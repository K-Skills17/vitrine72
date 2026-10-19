import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { intakeReminderEmail } from "@/lib/email/templates";
import { RULES } from "@vitrine72/core";

export const runtime = "nodejs";

/**
 * Vercel Cron: runs every hour.
 * Schedule in vercel.json: "0 * * * *"
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify Vercel Cron authorization
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();

  // Find projects in intake_pending
  const { data: projects } = await supabase
    .from("projects")
    .select(
      "id, payment_date, intake_token"
    )
    .eq("status", "intake_pending");

  if (!projects) return NextResponse.json({ ok: true, processed: 0 });

  let processed = 0;

  for (const project of projects) {
    if (!project.payment_date) continue;

    const paymentDate = new Date(project.payment_date);
    const hoursSince =
      (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60);

    const intakeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/intake/${project.intake_token}`;

    // Get client email from intake submission or payment
    const { data: submission } = await supabase
      .from("intake_submissions")
      .select("data")
      .eq("project_id", project.id)
      .maybeSingle();

    const email =
      (submission?.data as Record<string, string> | null)?.email ?? null;
    const name =
      (submission?.data as Record<string, string> | null)?.responsibleName ??
      "cliente";

    if (!email) continue;

    // Check if we already sent this reminder
    const { data: existingAudit } = await supabase
      .from("audit_log")
      .select("id")
      .eq("project_id", project.id)
      .like("action", "reminder_%")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastReminderAction = existingAudit?.id ? "sent" : null;

    // Reminder 1: at 24h
    if (
      hoursSince >= RULES.intakeReminder1Hours &&
      hoursSince < RULES.intakeReminder2Hours &&
      !lastReminderAction
    ) {
      await sendEmail({
        to: email,
        ...intakeReminderEmail({ clientName: name, intakeUrl, reminderNumber: 1 }),
      });
      await supabase.from("audit_log").insert({
        project_id: project.id,
        actor: "cron",
        action: "reminder_1_sent",
        from_status: "intake_pending",
        to_status: "intake_pending",
        metadata: { hoursSince },
      });
      processed++;
    }

    // Reminder 2: at 72h
    if (
      hoursSince >= RULES.intakeReminder2Hours &&
      hoursSince < RULES.intakePauseDays * 24
    ) {
      const { data: r2Audit } = await supabase
        .from("audit_log")
        .select("id")
        .eq("project_id", project.id)
        .eq("action", "reminder_2_sent")
        .maybeSingle();

      if (!r2Audit) {
        await sendEmail({
          to: email,
          ...intakeReminderEmail({
            clientName: name,
            intakeUrl,
            reminderNumber: 2,
          }),
        });
        await supabase.from("audit_log").insert({
          project_id: project.id,
          actor: "cron",
          action: "reminder_2_sent",
          from_status: "intake_pending",
          to_status: "intake_pending",
          metadata: { hoursSince },
        });
        processed++;
      }
    }

    // Pause at 7 days
    if (hoursSince >= RULES.intakePauseDays * 24) {
      await supabase
        .from("projects")
        .update({ status: "paused" })
        .eq("id", project.id);
      await supabase.from("audit_log").insert({
        project_id: project.id,
        actor: "cron",
        action: "auto_paused",
        from_status: "intake_pending",
        to_status: "paused",
        metadata: { reason: "intake_timeout" },
      });
      processed++;
    }
  }

  return NextResponse.json({ ok: true, processed });
}
