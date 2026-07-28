import { adminStatuses, statusStyles } from "@/components/admin/admin-data";
import type { AdminOrderStatus } from "@/lib/admin-api";

type AdminStatusBadgeProps = {
  status: AdminOrderStatus;
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const label = adminStatuses.find((item) => item.value === status)?.label ?? status;

  return (
    <span className={`inline-flex rounded-md px-3 py-1 font-sans text-xs font-light ${statusStyles[status]}`}>
      {label}
    </span>
  );
}
