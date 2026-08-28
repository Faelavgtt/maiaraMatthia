import { CalendarClock, Download, FileText, Mail, MessageCircle, Palette, Phone, Ruler, Trash2, UserRound } from "lucide-react";
import { adminStatuses } from "@/components/admin/admin-data";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminOrderFileUrl, type AdminOrderRow, type AdminOrderStatus } from "@/lib/admin-api";

type AdminOrdersTableProps = {
  orders: AdminOrderRow[];
  onStatusChange?: (code: string, status: AdminOrderStatus) => void;
  onDeleteOrder?: (code: string) => void;
  isUpdatingStatus?: boolean;
  isDeletingOrder?: boolean;
};

const orderTypeLabels: Record<string, string> = {
  familinha: "Familinha",
  maker: "Maker",
  galeria: "Galeria",
  outros: "Outros projetos",
};

export function AdminOrdersTable({
  orders,
  onStatusChange,
  onDeleteOrder,
  isUpdatingStatus = false,
  isDeletingOrder = false,
}: AdminOrdersTableProps) {
  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="rounded-xl border border-[#8b4114]/10 bg-white px-5 py-12 text-center font-sans text-sm font-light text-[#8b4114]/70 shadow-[0_14px_34px_rgba(93,51,29,0.05)]">
          Nenhum orçamento encontrado com os filtros atuais.
        </div>
      ) : (
        orders.map((order) => {
          const originalFile = order.files?.find((file) => file.kind === "original") ?? order.files?.[0];
          const fileUrl = originalFile ? adminOrderFileUrl(originalFile.id) : "";
          const isImage = originalFile?.content_type.startsWith("image/");
          const noteFields = parseOrderNotes(order.notes);
          const cleanNotes = noteFields.observations;
          const orderTypeTags = getOrderTypeTags(order);
          const orderDetails = [
            order.source === "maker" ? "Origem Maker" : order.source === "cart" ? "Carrinho" : "Manual",
          ].filter(Boolean);

          return (
            <article
              key={order.id}
              className="overflow-hidden rounded-xl border border-[#8b4114]/10 bg-white shadow-[0_14px_34px_rgba(93,51,29,0.05)] transition-shadow hover:shadow-[0_18px_44px_rgba(93,51,29,0.08)]"
            >
              <header className="flex flex-col gap-3 border-b border-[#8b4114]/10 bg-[#fff8f4] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="font-sans text-lg font-medium text-[#8b4114]">{order.code}</strong>
                  {orderTypeTags.map((type) => (
                    <span key={type} className="inline-flex rounded-full bg-[#8b4114] px-2.5 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-white">
                      {orderTypeLabels[type] ?? type}
                    </span>
                  ))}
                  {orderDetails.map((detail) => (
                    <span key={detail} className="rounded-full border border-[#ddb8a6] bg-white px-2.5 py-1 font-sans text-[11px] font-light text-[#8b4114]">
                      {detail}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 font-sans text-xs font-light text-[#8b4114]/65">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 text-[#76877e]" />
                    Criado em {formatDate(order.created_at)}
                  </span>
                  {order.expires_at && order.status === "awaiting_payment" && (
                    <span className="rounded-full bg-[#fff1cf] px-2.5 py-1 text-[#8b4114]">
                      Pagamento até {formatDate(order.expires_at)}
                    </span>
                  )}
                </div>
              </header>

              <div className="grid gap-4 p-4 lg:grid-cols-[minmax(220px,0.8fr)_minmax(320px,1.35fr)_minmax(220px,0.85fr)]">
                <section className="space-y-3">
                  <SectionLabel>Cliente</SectionLabel>
                  <InfoLine icon={UserRound} strong>{order.customer_name}</InfoLine>
                  <InfoLine icon={Phone}>{order.customer_phone}</InfoLine>
                  {order.customer_email && <InfoLine icon={Mail}>{order.customer_email}</InfoLine>}
                </section>

                <section>
                  <SectionLabel>Projeto</SectionLabel>
                  <h3 className="mt-2 font-sans text-lg font-medium leading-6 text-[#8b4114]">{order.product}</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {order.size && <DetailPill icon={Ruler} label="Tamanho" value={order.size} />}
                    {order.colors && <DetailPill icon={Palette} label="Cores" value={order.colors} />}
                    {noteFields.subtitle && <DetailPill label="Subtítulo" value={noteFields.subtitle} />}
                    {noteFields.orientation && <DetailPill label="Orientação" value={noteFields.orientation} />}
                  </div>
                  {cleanNotes && (
                    <p className="mt-3 rounded-lg bg-[#f0dfd4]/35 px-3 py-2 font-sans text-xs font-light leading-5 text-[#8b4114]/70">
                      {cleanNotes}
                    </p>
                  )}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 rounded-lg border border-[#f0dfd4] bg-white p-3">
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[#76877e]">Itens da sacola</p>
                      <div className="mt-2 space-y-1.5">
                        {order.items.map((item, index) => (
                          <p key={`${item.title}-${index}`} className="font-sans text-xs font-light leading-5 text-[#8b4114]/72">
                            <span className="font-medium text-[#8b4114]">{item.quantity}x {item.title}</span>
                            {item.order_type && ` · ${orderTypeLabels[item.order_type] ?? item.order_type}`}
                            {item.price && ` · ${item.price}`}
                            {item.dimensions && ` · ${item.dimensions}`}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section>
                  <SectionLabel>Arquivo</SectionLabel>
                  {originalFile ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex min-h-[76px] items-center gap-3 rounded-lg border border-[#ddb8a6] bg-[#fff8f4] p-2.5 font-sans text-xs font-light text-[#8b4114] transition-colors hover:bg-[#f0dfd4]"
                    >
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={`Foto anexada ao pedido ${order.code}`}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 items-center justify-center rounded-md bg-white">
                          <FileText className="h-4 w-4" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{originalFile.file_name}</span>
                        <span className="block text-[11px] text-[#8b4114]/55">{formatFileSize(originalFile.size_bytes)}</span>
                      </span>
                    </a>
                  ) : (
                    <p className="mt-2 flex min-h-[76px] items-center rounded-lg border border-dashed border-[#ddb8a6] bg-[#fff8f4] px-3 py-2 font-sans text-xs font-light text-[#8b4114]/58">
                      Sem arquivo anexado
                    </p>
                  )}
                </section>
              </div>

              <footer className="flex flex-col gap-3 border-t border-[#8b4114]/10 bg-[#fbf3ee] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <AdminStatusBadge status={order.status} />
                  {onStatusChange && (
                    <Select
                      value={order.status}
                      disabled={isUpdatingStatus}
                      onValueChange={(value) => onStatusChange(order.code, value as AdminOrderStatus)}
                    >
                      <SelectTrigger
                        className="h-10 w-full rounded-md border-[#ddb8a6] bg-white px-3 font-sans text-sm font-light text-[#8b4114] shadow-none outline-none ring-0 hover:border-[#c68043] focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#c68043] sm:w-64"
                        aria-label={`Alterar status do pedido ${order.code}`}
                      >
                        <SelectValue placeholder="Alterar status" />
                      </SelectTrigger>
                      <SelectContent className="z-[70] rounded-lg border-[#ddb8a6] bg-white p-1 font-sans text-[#8b4114] shadow-[0_18px_40px_rgba(93,51,29,0.16)]">
                        {adminStatuses.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                            className="rounded-md py-2 pl-8 pr-3 text-sm font-light text-[#8b4114] focus:bg-[#f0dfd4] focus:text-[#8b4114] data-[state=checked]:bg-[#8b4114] data-[state=checked]:text-white"
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex gap-2 lg:justify-end">
                  <a
                    href={fileUrl || undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!fileUrl}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#8b4114]/12 bg-white text-[#8b4114] transition-colors hover:bg-[#f0dfd4] ${fileUrl ? "" : "pointer-events-none opacity-40"}`}
                    aria-label="Baixar arquivo do pedido"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#76877e] text-white transition-transform hover:-translate-y-0.5"
                    aria-label="Chamar cliente no WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  {onDeleteOrder && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          disabled={isDeletingOrder}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Excluir pedido ${order.code}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-[#ddb8a6] bg-white text-[#8b4114]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-sans text-2xl font-light text-[#8b4114]">
                            Excluir pedido {order.code}?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-sans text-sm font-light leading-6 text-[#8b4114]/75">
                            Esta ação remove o pedido do painel, os itens vinculados e os arquivos anexados no armazenamento. Use apenas para testes, duplicados ou pedidos criados por engano.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="rounded-md border border-[#ddb8a6]/80 bg-[#f0dfd4]/40 p-3 font-sans text-sm font-light text-[#8b4114]">
                          <p><strong className="font-medium">Cliente:</strong> {order.customer_name}</p>
                          <p><strong className="font-medium">Projeto:</strong> {order.product}</p>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeletingOrder} className="border-[#ddb8a6] text-[#8b4114]">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isDeletingOrder}
                            onClick={() => onDeleteOrder(order.code)}
                            className="bg-red-700 text-white hover:bg-red-800"
                          >
                            {isDeletingOrder ? "Excluindo..." : "Excluir pedido"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </footer>
            </article>
          );
        })
      )}
    </div>
  );
}

function getOrderTypeTags(order: AdminOrderRow) {
  const itemTypes = (order.items ?? []).map((item) => item.order_type).filter((type): type is string => Boolean(type));
  const tags = Array.from(new Set(itemTypes.length ? itemTypes : [order.order_type]));

  return tags.sort((a, b) => tagSortWeight(a) - tagSortWeight(b));
}

function tagSortWeight(value: string) {
  const weights: Record<string, number> = {
    maker: 0,
    galeria: 1,
    outros: 2,
    familinha: 3,
  };

  return weights[value] ?? 99;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#76877e]">
      {children}
    </p>
  );
}

function InfoLine({
  icon: Icon,
  children,
  strong = false,
}: {
  icon: typeof UserRound;
  children: string;
  strong?: boolean;
}) {
  return (
    <p className={`flex min-w-0 items-center gap-2 font-sans ${strong ? "font-medium text-[#8b4114]" : "text-sm font-light text-[#8b4114]/70"}`}>
      <Icon className="h-4 w-4 shrink-0 text-[#76877e]" />
      <span className="truncate">{children}</span>
    </p>
  );
}

function DetailPill({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#f0dfd4] bg-[#fff8f4] px-3 py-2">
      <p className="flex items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[#76877e]">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="mt-1 truncate font-sans text-sm font-light text-[#8b4114]">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Tamanho não informado";
  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1) return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function parseOrderNotes(notes: string | null) {
  const fields: Record<string, string> = {};
  const looseLines: string[] = [];

  for (const rawLine of (notes ?? "").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.toLowerCase().startsWith("exemplo selecionado:")) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex > 0) {
      const key = normalizeNoteKey(line.slice(0, separatorIndex));
      const value = line.slice(separatorIndex + 1).trim();
      if (value && value !== "nao informado" && value !== "não informado" && value !== "sem observacoes" && value !== "sem observações") fields[key] = value;
      continue;
    }

    looseLines.push(line);
  }

  return {
    subtitle: fields.subtitulo,
    orientation: fields.orientacao,
    observations: fields.observacoesDaDesigner ?? looseLines.join(" · "),
  };
}

function normalizeNoteKey(key: string) {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+(.)/g, (_, letter: string) => letter.toUpperCase());
}
