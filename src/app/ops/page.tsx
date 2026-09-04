import { OpsDesk } from "@/components/ops-desk";

export const dynamic = "force-dynamic";

export default function OpsPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-10">
        <OpsDesk />
      </div>
    </main>
  );
}
