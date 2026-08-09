import type { FormEvent } from "react";
import { ImagePlus, Save, X } from "lucide-react";
import { galleryFrameFormatOptions, type GalleryFrameFormat } from "@/lib/gallery-products";
import { CurrencyInput, Field, ImageSlot, inputClassName, PanelTitle, textareaClassName } from "./AdminGalleryFormControls";
import type { ImageField, ProductForm, UpdateProductForm } from "./AdminGalleryTypes";

export function AdminGalleryProductForm({
  form,
  isSaving,
  isEditing,
  onSubmit,
  onCancelEdit,
  onUpdateForm,
  onUpdateCurrencyField,
  onUpdateFrameFormat,
  onOpenLibrary,
}: {
  form: ProductForm;
  isSaving: boolean;
  isEditing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
  onUpdateForm: UpdateProductForm;
  onUpdateCurrencyField: (key: "price" | "originalPrice", value: string) => void;
  onUpdateFrameFormat: (frameFormat: GalleryFrameFormat) => void;
  onOpenLibrary: (field: ImageField) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="min-h-0 rounded-md border border-[#8b4114]/15 bg-white p-4 shadow-[0_18px_40px_rgba(93,51,29,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#8b4114]/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#7d876d] text-white">
            <ImagePlus className="h-4 w-4" />
          </div>
          <h2 className="font-sans text-lg font-light text-[#8b4114]">{isEditing ? "Editar produto" : "Novo produto"}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button type="button" onClick={onCancelEdit} className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#8b4114]/15 bg-white px-4 font-sans text-xs font-light text-[#8b4114] transition-transform hover:-translate-y-0.5">
              <X className="h-4 w-4" />
              Cancelar
            </button>
          )}
          <button type="submit" disabled={isSaving} className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#8b4114] px-4 font-sans text-xs font-light text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : isEditing ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.05fr_0.95fr_0.9fr]">
        <div className="rounded-md border border-[#8b4114]/15 bg-[#fffaf5] p-3">
          <PanelTitle>Dados</PanelTitle>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Field label="Nome interno">
              <input required value={form.name} onChange={(event) => onUpdateForm("name", event.target.value)} className={inputClassName} placeholder="Kit jardim" />
            </Field>
            <Field label="Titulo">
              <input required value={form.title} onChange={(event) => onUpdateForm("title", event.target.value)} className={inputClassName} placeholder="Titulo do card" />
            </Field>
            <Field label="Categoria">
              <input required value={form.category} onChange={(event) => onUpdateForm("category", event.target.value)} className={inputClassName} placeholder="Galeria Pronta" />
            </Field>
            <Field label="Valor">
              <CurrencyInput required value={form.originalPrice} onChange={(value) => onUpdateForm("originalPrice", value)} onBlur={(value) => onUpdateCurrencyField("originalPrice", value)} placeholder="440,00" />
            </Field>
            <Field label="Valor com desconto">
              <CurrencyInput value={form.price} onChange={(value) => onUpdateForm("price", value)} onBlur={(value) => onUpdateCurrencyField("price", value)} placeholder="380,00" />
            </Field>
            <Field label="Dimensoes">
              <input required value={form.dimensions} onChange={(event) => onUpdateForm("dimensions", event.target.value)} className={inputClassName} placeholder="120x60cm" />
            </Field>
          </div>
          <Field label="Descricao" className="mt-2">
            <textarea required value={form.description} onChange={(event) => onUpdateForm("description", event.target.value)} className={`${textareaClassName} min-h-[6.75rem]`} placeholder="Resumo do produto" />
          </Field>
        </div>

        <div className="rounded-md border border-[#8b4114]/15 bg-[#fffaf5] p-3">
          <PanelTitle>Conteudo e Midia</PanelTitle>
          <Field label="Itens inclusos" className="mt-3">
            <textarea required value={form.includedItems} onChange={(event) => onUpdateForm("includedItems", event.target.value)} className={`${textareaClassName} min-h-[6.75rem]`} placeholder="Um item por linha" />
          </Field>
          <Field label="Texto placeholder" className="mt-2">
            <input value={form.placeholder} onChange={(event) => onUpdateForm("placeholder", event.target.value)} className={inputClassName} placeholder="Texto sem imagem" />
          </Field>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ImageSlot label="Imagem fixa" value={form.staticImage} required onChoose={() => onOpenLibrary("staticImage")} onClear={() => onUpdateForm("staticImage", "")} />
            <ImageSlot label="Imagem hover" value={form.hoverImage} onChoose={() => onOpenLibrary("hoverImage")} onClear={() => onUpdateForm("hoverImage", "")} />
          </div>
        </div>

        <div className="rounded-md border border-[#8b4114]/15 bg-[#fffaf5] p-3">
          <PanelTitle>Aparencia</PanelTitle>
          <div className="mt-3">
            <p className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#76877e]">Formato</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              {galleryFrameFormatOptions.map((option) => (
                <button key={option.value} type="button" onClick={() => onUpdateFrameFormat(option.value)} className={`rounded-md border p-2 text-left transition-colors ${form.frameFormat === option.value ? "border-[#7d876d] bg-white shadow-sm" : "border-[#8b4114]/15 bg-[#fffaf5] hover:bg-white"}`} aria-label={option.label}>
                  <span className="block rounded-sm border border-[#ddb8a6] bg-[#f0dfd4]" style={{ aspectRatio: option.aspectRatio }} />
                  <span className="mt-1.5 block truncate font-sans text-[0.64rem] font-light text-[#8b4114]/70">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
