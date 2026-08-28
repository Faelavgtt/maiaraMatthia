import { useEffect, useState, type ChangeEvent } from "react";
import { Check, Images, Trash2, Upload, X } from "lucide-react";
import {
  deleteAdminGalleryImage,
  listAdminGalleryImages,
  uploadAdminGalleryImage,
  type GalleryImageAsset,
} from "@/lib/admin-api";
import type { ImageField } from "./AdminGalleryTypes";

export function AdminGalleryImageLibraryModal({
  activeField,
  selectedUrl,
  onSelect,
  onClose,
  onStatus,
}: {
  activeField: ImageField;
  selectedUrl: string;
  onSelect: (url: string) => void;
  onClose: () => void;
  onStatus: (message: string) => void;
}) {
  const [images, setImages] = useState<GalleryImageAsset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("Carregando biblioteca...");

  const loadImages = async (nextCursor?: string) => {
    setIsLoading(true);

    try {
      const data = await listAdminGalleryImages(nextCursor);
      setImages((current) => (nextCursor ? [...current, ...data.images] : data.images));
      setCursor(data.cursor);
      setTruncated(data.truncated);
      setMessage(data.images.length ? "Biblioteca de imagens atualizada." : "Nenhuma imagem na biblioteca ainda.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel carregar a biblioteca.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);
    setMessage(`Preparando ${files.length} imagem(ns)...`);

    try {
      const uploads: GalleryImageAsset[] = [];

      for (const file of files) {
        const webpFile = await convertImageToWebp(file);
        const uploaded = await uploadAdminGalleryImage(webpFile);
        uploads.push({
          key: uploaded.objectKey,
          url: uploaded.url,
          size: webpFile.size,
          uploaded: new Date().toISOString(),
          contentType: "image/webp",
        });
      }

      setImages((current) => [...uploads, ...current]);
      const doneMessage = `${uploads.length} imagem(ns) pronta(s) na biblioteca.`;
      setMessage(doneMessage);
      onStatus(doneMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha ao converter ou enviar imagens.";
      setMessage(errorMessage);
      onStatus(errorMessage);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = async (image: GalleryImageAsset) => {
    try {
      await deleteAdminGalleryImage(image.key);
      setImages((current) => current.filter((item) => item.key !== image.key));
      const doneMessage = "Imagem excluida da biblioteca.";
      setMessage(doneMessage);
      onStatus(doneMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel excluir a imagem.";
      setMessage(errorMessage);
      onStatus(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1713]/55 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-md border border-[#8b4114]/15 bg-[#fffaf5] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#8b4114]/10 bg-white p-5">
          <div>
            <p className="font-sans text-xs font-normal uppercase tracking-[0.18em] text-[#76877e]">Biblioteca de imagens</p>
            <h2 className="mt-1 font-sans text-2xl font-light text-[#8b4114]">
              Escolher {activeField === "staticImage" ? "imagem fixa" : "imagem hover"}
            </h2>
            <p className="mt-1 font-sans text-xs font-light leading-5 text-[#8b4114]">{message}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/15 bg-white text-[#8b4114] hover:bg-[#8b4114] hover:text-white" aria-label="Fechar biblioteca">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-[#8b4114]/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#7d876d] px-5 font-sans text-xs font-light text-white transition-transform hover:-translate-y-0.5">
            <Upload className="h-4 w-4" />
            {isUploading ? "Preparando..." : "Enviar imagens"}
            <input type="file" accept="image/*" multiple className="sr-only" onChange={uploadFiles} disabled={isUploading} />
          </label>
          <button type="button" onClick={() => loadImages()} disabled={isLoading} className="inline-flex h-10 items-center justify-center rounded-full border border-[#8b4114]/15 bg-white px-5 font-sans text-xs font-light text-[#8b4114] hover:bg-[#f0dfd4] disabled:opacity-60">
            Atualizar biblioteca
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {isLoading && images.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center font-sans text-sm font-light text-[#8b4114]">Carregando imagens...</div>
          ) : images.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center text-[#8b4114]">
              <Images className="h-8 w-8" />
              <p className="mt-2 font-sans text-sm font-light">Envie imagens para comecar a biblioteca.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {images.map((image) => {
                const isSelected = selectedUrl === image.url;

                return (
                  <article key={image.key} className={`overflow-hidden rounded-md border bg-white shadow-sm ${isSelected ? "border-[#7d876d]" : "border-[#8b4114]/15"}`}>
                    <button type="button" onClick={() => onSelect(image.url)} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#f0dfd4]">
                      <img src={image.url} alt="" className="h-full w-full object-cover" />
                      {isSelected && (
                        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#7d876d] text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                    <div className="p-3">
                      <p className="truncate font-sans text-[0.68rem] font-light text-[#8b4114]">{image.key.replace("gallery/", "")}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <button type="button" onClick={() => onSelect(image.url)} className="inline-flex h-8 items-center justify-center rounded-full bg-[#8b4114] px-3 font-sans text-[0.68rem] font-light text-white">
                          Selecionar
                        </button>
                        <button type="button" onClick={() => removeImage(image)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8b4114]/15 text-[#8b4114] hover:bg-[#8b4114] hover:text-white" aria-label="Excluir imagem">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {truncated && cursor && (
            <button type="button" onClick={() => loadImages(cursor)} className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[#8b4114]/15 bg-white px-5 font-sans text-xs font-light text-[#8b4114] hover:bg-[#f0dfd4]">
              Carregar mais
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

async function convertImageToWebp(file: File) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Nao foi possivel preparar a imagem.");

  context.drawImage(image, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) throw new Error(`Nao foi possivel preparar ${file.name}.`);

  const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`O navegador nao conseguiu abrir ${file.name}.`));
    };
    image.src = url;
  });
}
