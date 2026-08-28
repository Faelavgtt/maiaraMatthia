import { adminStatuses, statusStyles } from "@/components/admin/admin-data";
import type { AdminOrderStatus } from "@/lib/admin-api";

type AdminStatusBadgeProps = {
  status: AdminOrderStatus;
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const label = adminStatuses.find((item) => item.value === status)?.label ?? status;

  return (
    <span className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm font-medium ${statusStyles[status]}`}>
      <span className="h-2.5 w-2.5 rounded-full" aria-hidden="true" />
      {label}
    </span>
  );
}
