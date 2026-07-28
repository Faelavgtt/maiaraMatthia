import { Search } from "lucide-react";
import { adminStatuses } from "@/components/admin/admin-data";
import type { AdminOrderStatus } from "@/lib/admin-api";

type AdminToolbarProps = {
  search: string;
  status: AdminOrderStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AdminOrderStatus | "all") => void;
};

export function AdminToolbar({ search, status, onSearchChange, onStatusChange }: AdminToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-[#8b4114]/20 bg-white/80 p-3 sm:flex-row sm:items-center">
      <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#ddb8a6] bg-white px-3">
        <Search className="h-4 w-4 shrink-0 text-[#76877e]" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full bg-transparent font-sans text-sm font-light outline-none placeholder:text-[#76877e]"
          placeholder="Buscar por pedido, cliente ou projeto"
        />
      </div>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as AdminOrderStatus | "all")}
        className="h-11 rounded-md border border-[#ddb8a6] bg-white px-3 font-sans text-sm font-light text-[#8b4114] outline-none focus:border-[#c68043] sm:w-56"
      >
        <option value="all">Todos os status</option>
        {adminStatuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
