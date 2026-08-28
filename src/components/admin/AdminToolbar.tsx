import { Filter, RotateCcw, Search, X } from "lucide-react";
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
    "h-10 rounded-xl border-[#8b4114]/15 bg-white px-3 font-sans text-xs sm:text-sm font-light text-[#8b4114] shadow-sm outline-none ring-0 transition-all hover:border-[#8b4114]/35 focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#8b4114]";
  const selectContentClassName =
    "z-[70] rounded-xl border-[#8b4114]/15 bg-white p-1 font-sans text-[#8b4114] shadow-[0_12px_32px_rgba(93,51,29,0.12)]";
  const selectItemClassName =
    "rounded-lg py-2 pl-8 pr-3 text-xs sm:text-sm font-light text-[#8b4114] transition-colors focus:bg-[#f0dfd4] focus:text-[#8b4114] data-[state=checked]:bg-[#8b4114] data-[state=checked]:text-white";

  const hasActiveFilters =
    search.trim().length > 0 ||
    status !== "all" ||
    type !== "all" ||
    source !== "all" ||
    fileState !== "all";

  const activeFilterCount = [
    search.trim().length > 0,
    status !== "all",
    type !== "all",
    source !== "all",
    fileState !== "all",
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-[#8b4114]/10 bg-white p-3.5 shadow-[0_4px_20px_rgba(93,51,29,0.03)]">
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(140px,1fr))_auto] lg:items-center">
        {/* Search Input */}
        <div className="relative flex h-10 items-center rounded-xl border border-[#8b4114]/15 bg-white px-3 shadow-sm transition-all focus-within:border-[#8b4114]">
          <Search className="h-4 w-4 shrink-0 text-[#76877e]" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent px-2 font-sans text-xs sm:text-sm font-light text-[#8b4114] outline-none placeholder:text-[#76877e]/70"
            placeholder="Buscar por pedido, cliente ou projeto..."
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#76877e] hover:bg-[#f0dfd4] hover:text-[#8b4114]"
              aria-label="Limpar busca"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as AdminOrderStatus | "all")}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Status" />
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

        {/* Type Filter */}
        <Select
          value={type}
          onValueChange={(value) => onTypeChange(value as AdminOrderType | "all")}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Tipo" />
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

        {/* Source Filter */}
        <Select
          value={source}
          onValueChange={(value) => onSourceChange(value as AdminOrderSource | "all")}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Origem" />
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

        {/* File State Filter */}
        <Select
          value={fileState}
          onValueChange={(value) => onFileStateChange(value as "all" | "with_files" | "without_files")}
        >
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Arquivos" />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            <SelectItem className={selectItemClassName} value="all">Todos os arquivos</SelectItem>
            <SelectItem className={selectItemClassName} value="with_files">Com anexo</SelectItem>
            <SelectItem className={selectItemClassName} value="without_files">Sem anexo</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters Button */}
        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 font-sans text-xs sm:text-sm font-light transition-all ${
            hasActiveFilters
              ? "border-[#8b4114]/25 bg-[#fffaf5] text-[#8b4114] hover:bg-[#f0dfd4] shadow-sm"
              : "border-transparent text-[#8b4114]/40 cursor-not-allowed"
          }`}
          title="Redefinir todos os filtros"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Limpar</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b4114] text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

