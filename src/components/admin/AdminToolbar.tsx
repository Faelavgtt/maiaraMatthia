import { RotateCcw, Search } from "lucide-react";
import { adminStatuses } from "@/components/admin/admin-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminOrderSource, AdminOrderStatus, AdminOrderType } from "@/lib/admin-api";

type AdminToolbarProps = {
  search: string;
  status: AdminOrderStatus | "all";
  type: AdminOrderType | "all";
  source: AdminOrderSource | "all";
  fileState: "all" | "with_files" | "without_files";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AdminOrderStatus | "all") => void;
  onTypeChange: (value: AdminOrderType | "all") => void;
  onSourceChange: (value: AdminOrderSource | "all") => void;
  onFileStateChange: (value: "all" | "with_files" | "without_files") => void;
  onClearFilters: () => void;
};

const orderTypes: Array<{ value: AdminOrderType; label: string }> = [
  { value: "familinha", label: "Familinha" },
  { value: "maker", label: "Maker" },
  { value: "galeria", label: "Galeria" },
  { value: "outros", label: "Outros projetos" },
];

const orderSources: Array<{ value: AdminOrderSource; label: string }> = [
  { value: "cart", label: "Carrinho" },
  { value: "maker", label: "Maker" },
  { value: "manual", label: "Manual" },
];

export function AdminToolbar({
  search,
  status,
  type,
  source,
  fileState,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSourceChange,
  onFileStateChange,
  onClearFilters,
}: AdminToolbarProps) {
  const selectTriggerClassName =
    "h-11 rounded-md border-[#ddb8a6] bg-white px-3 font-sans text-sm font-light text-[#8b4114] shadow-none outline-none ring-0 transition-colors hover:border-[#c68043] focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#c68043] data-[state=open]:bg-[#fff8f4]";
  const selectContentClassName =
    "z-[70] rounded-lg border-[#ddb8a6] bg-white p-1 font-sans text-[#8b4114] shadow-[0_18px_40px_rgba(93,51,29,0.16)]";
  const selectItemClassName =
    "rounded-md py-2 pl-8 pr-3 text-sm font-light text-[#8b4114] focus:bg-[#f0dfd4] focus:text-[#8b4114] data-[state=checked]:bg-[#8b4114] data-[state=checked]:text-white";

  return (
    <div className="grid gap-3 rounded-md border border-[#8b4114]/20 bg-white/80 p-3 lg:grid-cols-[minmax(220px,1fr)_repeat(4,minmax(150px,190px))_auto] lg:items-center">
      <div className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-[#ddb8a6] bg-white px-3">
        <Search className="h-4 w-4 shrink-0 text-[#76877e]" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full bg-transparent font-sans text-sm font-light outline-none placeholder:text-[#76877e]"
          placeholder="Buscar por pedido, cliente ou projeto"
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as AdminOrderStatus | "all")}
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          <SelectItem className={selectItemClassName} value="all">Todos os status</SelectItem>
        {adminStatuses.map((item) => (
          <SelectItem className={selectItemClassName} key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>

      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as AdminOrderType | "all")}
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
        <SelectItem className={selectItemClassName} value="all">Todos os tipos</SelectItem>
        {orderTypes.map((item) => (
          <SelectItem className={selectItemClassName} key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>

      <Select
        value={source}
        onValueChange={(value) => onSourceChange(value as AdminOrderSource | "all")}
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Todas as origens" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
        <SelectItem className={selectItemClassName} value="all">Todas as origens</SelectItem>
        {orderSources.map((item) => (
          <SelectItem className={selectItemClassName} key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>

      <Select
        value={fileState}
        onValueChange={(value) => onFileStateChange(value as "all" | "with_files" | "without_files")}
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Todos os arquivos" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          <SelectItem className={selectItemClassName} value="all">Todos os arquivos</SelectItem>
          <SelectItem className={selectItemClassName} value="with_files">Com arquivo</SelectItem>
          <SelectItem className={selectItemClassName} value="without_files">Sem arquivo</SelectItem>
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#8b4114]/15 bg-white px-3 font-sans text-sm font-light text-[#8b4114] transition-colors hover:bg-[#f0dfd4]"
      >
        <RotateCcw className="h-4 w-4" />
        Limpar
      </button>
    </div>
  );
}
