import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, Download, FileText, Images, RefreshCw, Trash2 } from "lucide-react";
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
import {
  adminBucketFileUrl,
  deleteAdminBucketFile,
  listAdminBucketFiles,
  type BucketFileAsset,
} from "@/lib/admin-api";

const prefixOptions = [
  { value: "all", label: "Todos os arquivos" },
  { value: "gallery/", label: "Galeria" },
  { value: "orders/", label: "Pedidos" },
];

const groupLabels: Record<BucketFileAsset["group"], string> = {
  gallery: "Galeria",
  orders: "Pedidos",
  other: "Outros",
};

const AdminBucket = () => {
  const [prefix, setPrefix] = useState("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["admin-bucket-files", prefix],
    queryFn: () => listAdminBucketFiles(prefix === "all" ? "" : prefix),
    retry: false,
  });

  const deleteFile = useMutation({
    mutationFn: deleteAdminBucketFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-bucket-files"] }),
  });

  const files = data?.files ?? [];
  const filteredFiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return files;

    return files.filter((file) =>
      [file.key, file.contentType, groupLabels[file.group]]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [files, search]);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const imageCount = files.filter((file) => isPreviewableImage(file)).length;

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Bucket de imagens</p>
            <h1 className="font-sans text-2xl font-extralight leading-tight text-[#8b4114] sm:text-3xl md:text-4xl">Visão geral do armazenamento</h1>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Consulte arquivos enviados para galeria e pedidos. Exclua apenas itens duplicados, testes ou arquivos que não devem mais ficar armazenados.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#8b4114]/15 bg-white px-5 font-sans text-sm font-light text-[#8b4114] transition-colors hover:bg-[#f0dfd4] disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MetricCard label="Arquivos listados" value={files.length.toString()} icon={Database} />
          <MetricCard label="Imagens" value={imageCount.toString()} icon={Images} />
          <MetricCard label="Espaco usado" value={formatFileSize(totalSize)} icon={FileText} />
        </div>

        <div className="mt-5 grid gap-3 rounded-md border border-[#8b4114]/20 bg-white/80 p-3 lg:grid-cols-[220px_minmax(220px,1fr)]">
          <Select value={prefix} onValueChange={setPrefix}>
            <SelectTrigger className="h-11 rounded-md border-[#ddb8a6] bg-white px-3 font-sans text-sm font-light text-[#8b4114] shadow-none focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Todos os arquivos" />
            </SelectTrigger>
            <SelectContent className="z-[70] rounded-lg border-[#ddb8a6] bg-white p-1 font-sans text-[#8b4114] shadow-[0_18px_40px_rgba(93,51,29,0.16)]">
              {prefixOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-md py-2 pl-8 pr-3 text-sm font-light text-[#8b4114] focus:bg-[#f0dfd4] focus:text-[#8b4114] data-[state=checked]:bg-[#8b4114] data-[state=checked]:text-white">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-md border border-[#ddb8a6] bg-white px-3 font-sans text-sm font-light text-[#8b4114] outline-none placeholder:text-[#76877e] focus:border-[#c68043]"
            placeholder="Buscar por nome, tipo ou pasta"
          />
        </div>

        <div className="mt-5 rounded-xl border border-[#8b4114]/10 bg-white p-4 shadow-[0_14px_34px_rgba(93,51,29,0.05)]">
          {isLoading ? (
            <div className="px-5 py-12 text-center font-sans text-sm font-light text-[#8b4114]/70">Carregando arquivos do bucket...</div>
          ) : isError ? (
            <div className="px-5 py-12 text-center font-sans text-sm font-light text-red-700">Não foi possível carregar o bucket.</div>
          ) : filteredFiles.length === 0 ? (
            <div className="px-5 py-12 text-center font-sans text-sm font-light text-[#8b4114]/70">Nenhum arquivo encontrado.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <BucketFileCard key={file.key} file={file} isDeleting={deleteFile.isPending} onDelete={(key) => deleteFile.mutate(key)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function BucketFileCard({ file, isDeleting, onDelete }: { file: BucketFileAsset; isDeleting: boolean; onDelete: (key: string) => void }) {
  const isImage = isPreviewableImage(file);
  const url = adminBucketFileUrl(file.key);
  const fileName = file.key.split("/").pop() ?? file.key;
  const contentType = file.contentType ?? inferContentTypeFromKey(file.key);

  return (
    <article className="overflow-hidden rounded-xl border border-[#8b4114]/10 bg-[#fffaf5] shadow-sm transition-shadow hover:shadow-[0_16px_36px_rgba(93,51,29,0.08)]">
      <a href={url} target="_blank" rel="noreferrer" className="relative block aspect-[4/3] overflow-hidden bg-[#f0dfd4]">
        {isImage ? (
          <img src={url} alt={fileName} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]" loading="lazy" />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#8b4114]">
            <FileText className="h-8 w-8" />
            <span className="font-sans text-xs font-light">Arquivo</span>
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[#8b4114] shadow-sm">
          {groupLabels[file.group]}
        </span>
      </a>

      <div className="p-4">
        <p className="truncate font-sans text-sm font-medium text-[#8b4114]" title={fileName}>{fileName}</p>
        <p className="mt-1 line-clamp-2 min-h-8 break-all font-sans text-[11px] font-light leading-4 text-[#8b4114]/55" title={file.key}>
          {file.key}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[#76877e]">Tamanho</p>
            <p className="mt-1 font-sans text-sm font-light text-[#8b4114]">{formatFileSize(file.size)}</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[#76877e]">Data</p>
            <p className="mt-1 font-sans text-sm font-light text-[#8b4114]">{formatDate(file.uploaded)}</p>
          </div>
        </div>

        <p className="mt-3 truncate font-sans text-xs font-light text-[#8b4114]/60" title={contentType ?? undefined}>
          {contentType ?? "tipo não informado"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#8b4114]/10 bg-white px-4 py-3">
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[#8b4114]/12 bg-white px-4 font-sans text-xs font-light text-[#8b4114] transition-colors hover:bg-[#f0dfd4]" aria-label="Abrir arquivo">
          <Download className="h-4 w-4" />
          Abrir
        </a>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" disabled={isDeleting} className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50" aria-label="Excluir arquivo">
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-[#ddb8a6] bg-white text-[#8b4114]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-sans text-2xl font-light text-[#8b4114]">Excluir arquivo?</AlertDialogTitle>
              <AlertDialogDescription className="font-sans text-sm font-light leading-6 text-[#8b4114]/75">
                Esta ação remove o objeto do bucket. Se ele estiver vinculado a um produto ou pedido, a imagem/anexo pode deixar de abrir no painel.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="rounded-md border border-[#ddb8a6]/80 bg-[#f0dfd4]/40 p-3 font-sans text-xs font-light text-[#8b4114] break-all">
              {file.key}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting} className="border-[#ddb8a6] text-[#8b4114]">Cancelar</AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={() => onDelete(file.key)} className="bg-red-700 text-white hover:bg-red-800">
                {isDeleting ? "Excluindo..." : "Excluir arquivo"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}

function isPreviewableImage(file: BucketFileAsset) {
  return (file.contentType ?? inferContentTypeFromKey(file.key))?.startsWith("image/") ?? false;
}

function inferContentTypeFromKey(key: string) {
  const extension = key.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    pdf: "application/pdf",
  };

  return extension ? contentTypes[extension] ?? null : null;
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Database }) {
  return (
    <div className="rounded-md border border-[#8b4114]/10 bg-white/75 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-sans text-xs font-light uppercase tracking-[0.14em] text-[#76877e]">{label}</p>
          <p className="mt-1 font-sans text-2xl font-light text-[#8b4114]">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-[#76877e]" />
      </div>
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
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1) return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default AdminBucket;
