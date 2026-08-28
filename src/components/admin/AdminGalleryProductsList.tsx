import { Edit3, Layers3, Trash2 } from "lucide-react";
import type { GalleryProduct } from "@/lib/gallery-products";

export function AdminGalleryProductsList({
  products,
  onEditProduct,
  onRemoveProduct,
}: {
  products: GalleryProduct[];
  onEditProduct: (product: GalleryProduct) => void;
  onRemoveProduct: (id: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-col rounded-md border border-[#8b4114]/15 bg-white p-4 shadow-[0_18px_40px_rgba(93,51,29,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#8b4114]/10 pb-3">
        <div>
          <h2 className="font-sans text-lg font-light text-[#8b4114]">Produtos cadastrados</h2>
          <p className="mt-0.5 font-sans text-xs font-light text-[#8b4114]/65">Carrossel unico da home.</p>
        </div>
        <Layers3 className="h-5 w-5 text-[#76877e]" />
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {products.map((product) => (
          <article key={product.id} className="grid gap-3 rounded-md border border-[#8b4114]/15 bg-white p-2.5 shadow-sm sm:grid-cols-[5rem_1fr_auto]">
            <div className="overflow-hidden rounded-sm bg-[#f0dfd4]" style={{ aspectRatio: product.aspectRatio }}>
              <img src={product.src} alt={product.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-xs font-light uppercase tracking-[0.16em] text-[#76877e]">{product.number} - {product.category}</p>
              <h3 className="mt-1 font-sans text-base font-light text-[#8b4114]">{product.title}</h3>
              <p className="mt-1 font-sans text-sm font-medium text-[#8b4114]">{product.price}</p>
              <p className="mt-1 line-clamp-2 font-sans text-xs font-light leading-5 text-[#8b4114]/65">{product.description}</p>
              <p className="mt-1 font-sans text-[0.68rem] font-light text-[#8b4114]">
                {product.dimensions} | {product.includedItems.length} itens | {product.frameFormat}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:flex-col">
              <button type="button" onClick={() => onEditProduct(product)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/15 text-[#8b4114] transition-colors hover:bg-[#7d876d] hover:text-white" aria-label={`Editar ${product.title}`}>
                <Edit3 className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onRemoveProduct(product.id)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/15 text-[#8b4114] transition-colors hover:bg-[#8b4114] hover:text-white" aria-label={`Remover ${product.title}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
