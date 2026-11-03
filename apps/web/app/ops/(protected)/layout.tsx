export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OpsNav } from "@/components/ops/OpsNav";
import { verifyOpsToken, OPS_COOKIE } from "@/lib/ops-auth";

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(OPS_COOKIE)?.value;

  if (!verifyOpsToken(token)) {
    redirect("/ops/login");
  }

  return (
    <div className="min-h-screen bg-brand-dark flex">
      <OpsNav />
      <main className="flex-1 ml-56 p-6">{children}</main>
    </div>
  );
}
