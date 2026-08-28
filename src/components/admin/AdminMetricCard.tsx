import type { LucideIcon } from "lucide-react";

type AdminMetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export function AdminMetricCard({ icon: Icon, label, value }: AdminMetricCardProps) {
  return (
    <article className="rounded-xl border border-[#8b4114]/10 bg-white p-5 shadow-[0_12px_26px_rgba(93,51,29,0.045)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f0dfd4] text-[#8b4114]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-sans text-sm font-light text-[#8b4114]/75">{label}</p>
      <strong className="mt-1 block font-sans text-3xl font-extralight text-[#8b4114]">{String(value).padStart(2, "0")}</strong>
    </article>
  );
}
