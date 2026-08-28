import { statusConfig } from "@/components/admin/admin-data";
import type { AdminOrderStatus } from "@/lib/admin-api";

type AdminStatusBadgeProps = {
  status: AdminOrderStatus;
  size?: "sm" | "md";
};

export function AdminStatusBadge({ status, size = "md" }: AdminStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    badgeClass: "bg-stone-50 border border-stone-200 text-stone-800",
    dotClass: "bg-stone-500",
  };

  const isPulsing = Boolean(config.pulseClass);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-sans font-medium tracking-tight whitespace-nowrap transition-all select-none ${
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      } ${config.badgeClass}`}
    >
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        {isPulsing && config.pulseClass && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.pulseClass}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      </span>
      <span className="leading-none">{config.label}</span>
    </span>
  );
}
