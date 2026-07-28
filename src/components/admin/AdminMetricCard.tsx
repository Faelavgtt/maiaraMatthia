import type { LucideIcon } from "lucide-react";

type AdminMetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export function AdminMetricCard({ icon: Icon, label, value }: AdminMetricCardProps) {
  return (
    <article className="rounded-md border border-[#8b4114]/25 bg-white p-5 shadow-[0_12px_28px_rgba(93,51,29,0.06)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#d39a7e] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-sans text-sm font-light text-[#8b4114]/75">{label}</p>
      <strong className="font-sans text-3xl font-extralight text-[#8b4114]">{String(value).padStart(2, "0")}</strong>
    </article>
  );
}
