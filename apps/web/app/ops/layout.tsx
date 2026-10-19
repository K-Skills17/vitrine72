export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/server";
import { OpsNav } from "@/components/ops/OpsNav";

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createAnonClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/ops/login");
  }

  // Check email allowlist
  const allowlist = (process.env.OPS_EMAIL_ALLOWLIST ?? "").split(",").map((e) => e.trim());
  if (!allowlist.includes(session.user.email ?? "")) {
    await supabase.auth.signOut();
    redirect("/ops/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-brand-dark flex">
      <OpsNav />
      <main className="flex-1 ml-56 p-6">{children}</main>
    </div>
  );
}
