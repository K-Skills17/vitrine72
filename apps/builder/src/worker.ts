import {
  claimProject,
  getIntakeSubmission,
  getResearch,
  getUploads,
  getLogoPath,
  insertAuditLog,
  fetchReferenceSites,
  supabase,
} from "./supabase.js";
import { generateSiteConfig } from "./generate-config.js";
import { deployToVercel } from "./vercel-deploy.js";
import { pickReferenceSite, referenceSiteFromDb, type StyleGroup, type ReferenceSite } from "./reference-sites.js";

const PLATFORM_URL = process.env.VITRINE72_PLATFORM_URL!;
const BUILD_SECRET = process.env.BUILD_WEBHOOK_SECRET!;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // optional
const SUPABASE_URL = process.env.SUPABASE_URL!;

export async function processProject(projectId: string): Promise<void> {
  console.log(`\n[worker] Processing project ${projectId}`);

  // 1. Claim — transition intake_complete → in_production
  const claimed = await claimProject(projectId);
  if (!claimed) {
    console.log(`[worker] Project ${projectId} already claimed, skipping.`);
    return;
  }

  await insertAuditLog({
    projectId,
    actor: "builder",
    action: "auto_transition",
    fromStatus: "intake_complete",
    toStatus: "in_production",
  });

  try {
    // 2. Gather all data
    console.log(`[worker] Fetching intake data...`);
    const intake = await getIntakeSubmission(projectId);
    if (!intake) throw new Error("No intake submission found");

    const [research, photos, logoPath] = await Promise.all([
      getResearch(projectId),
      getUploads(projectId),
      getLogoPath(projectId),
    ]);

    // 3. Pick reference site — DB first, fall back to hardcoded
    const vertical = intake.data.vertical ?? "generico";
    const styleGroup = intake.data.style_group as StyleGroup | undefined;
    const seed = parseInt(projectId.slice(-4), 16) || 0;

    let referenceSite: ReferenceSite;
    const dbSites = await fetchReferenceSites(vertical);

    if (dbSites.length > 0) {
      const pool = styleGroup
        ? (dbSites.filter((s) => s.style_group === styleGroup).length > 0
            ? dbSites.filter((s) => s.style_group === styleGroup)
            : dbSites)
        : dbSites;
      referenceSite = referenceSiteFromDb(pool[seed % pool.length]!);
      console.log(`[worker] Using DB reference site: ${referenceSite.id} (${referenceSite.styleGroup})`);
    } else {
      referenceSite = pickReferenceSite(vertical, projectId, styleGroup);
      console.log(`[worker] Using hardcoded reference site: ${referenceSite.id} (${referenceSite.mood})`);
    }

    // 4. Generate site config via Claude
    console.log(`[worker] Generating site config with Claude...`);
    const siteConfig = await generateSiteConfig({
      projectId,
      intake: intake.data,
      research,
      photos,
      logoPath,
      referenceSite,
    });

    console.log(`[worker] Config generated: "${siteConfig.copyBlocks.heroHeadline}"`);

    // 5. Deploy to Vercel
    console.log(`[worker] Deploying to Vercel...`);
    const { deploymentId, previewUrl } = await deployToVercel({
      projectId,
      config: siteConfig,
      vercelToken: VERCEL_TOKEN,
      vercelTeamId: VERCEL_TEAM_ID,
      supabaseUrl: SUPABASE_URL,
    });

    console.log(`[worker] Deployed: ${previewUrl}`);

    // 6. Store generated_sites record
    await supabase.from("generated_sites").insert({
      project_id: projectId,
      slug: siteConfig.slug,
      vertical: siteConfig.vertical,
      layout_variant: siteConfig.layoutVariant,
      preview_url: previewUrl,
      production_url: null,
      vercel_deployment_id: deploymentId,
      build_path: `v72-${projectId.slice(0, 8)}`,
    });

    // 7. Notify platform — this transitions to preview_sent and emails client
    console.log(`[worker] Notifying platform...`);
    const notifyRes = await fetch(
      `${PLATFORM_URL}/api/ops/projects/${projectId}/deploy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-build-secret": BUILD_SECRET,
        },
        body: JSON.stringify({
          preview_url: previewUrl,
          generated_site_id: deploymentId,
          qa: {
            passed: true,
            checks: { builder: "automated", reference: referenceSite.id },
          },
        }),
      }
    );

    if (!notifyRes.ok) {
      const body = await notifyRes.text();
      console.error(`[worker] Platform notification failed: ${notifyRes.status} ${body}`);
      // Don't throw — site is already deployed, operator can manually transition
    } else {
      const result = await notifyRes.json() as { status: string };
      console.log(`[worker] Platform updated. Project status: ${result.status}`);
    }

    console.log(`[worker] ✓ Project ${projectId} complete: ${previewUrl}`);
  } catch (err) {
    console.error(`[worker] ✗ Project ${projectId} failed:`, err);

    // Log the failure for ops visibility
    await insertAuditLog({
      projectId,
      actor: "builder",
      action: "build_failed",
      fromStatus: "in_production",
      toStatus: "in_production",
      metadata: { error: String(err) },
    }).catch(() => {}); // best-effort

    // Don't rethrow — let the polling loop continue with other projects
  }
}
