import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Ruler, Check, ShoppingBag } from "lucide-react";
import { createPortal } from "react-dom";

export interface GalleryProject {
  id: string;
  number: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  dimensions: string;
  includedItems: readonly string[];
  description: string;
  placeholder: string;
  src: string;
  hoverSrc?: string;
  surface: string;
  width: number;
  aspectRatio: string;
  offset: number;
  rotate: number;
}

interface GalleryModalProps {
  project: GalleryProject | null;
  onClose: () => void;
  onAddToCart: (project: GalleryProject) => void;
}

export function GalleryModal({ project, onClose, onAddToCart }: GalleryModalProps) {
  if (!project) return null;

  const hasDiscountPrice = Boolean(project.originalPrice && project.originalPrice !== project.price);

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop escurecido */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1f1713]/60 backdrop-blur-xs"
        />

        {/* Conteúdo do Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border-2 border-[#e6c29c] bg-[#fffaf5] p-6 shadow-2xl sm:p-8"
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#8b4114]/10 text-[#8b4114] transition-colors hover:bg-[#8b4114] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Tag da Categoria */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e8efda] px-3 py-0.5 text-[0.68rem] font-semibold tracking-wider text-[#5f6850]">
            <Sparkles className="h-3 w-3" />
            {project.category}
          </div>

          {/* Título & Preço */}
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#8b4114]/10 pb-4">
            <div>
              <h3 className="font-sans text-2xl font-normal text-[#8b4114]">{project.title}</h3>
              <p className="mt-0.5 flex items-center gap-1 font-sans text-xs text-[#8b4114]/60">
                <Ruler className="h-3.5 w-3.5" />
                {project.dimensions}
              </p>
            </div>
            <div className="text-right">
              {hasDiscountPrice && (
                <span className="block text-xs text-[#8b4114]/50 line-through">
                  {project.originalPrice}
                </span>
              )}
              <span className="font-sans text-2xl font-semibold text-[#8b4114]">
                {project.price}
              </span>
            </div>
          </div>

          {/* Descrição */}
          <p className="mt-4 font-sans text-sm font-light leading-relaxed text-[#8b4114]/80">
            {project.description}
          </p>

          {/* Itens Inclusos no Kit */}
          <div className="mt-5 rounded-2xl border border-[#e6c29c]/60 bg-[#fff9f2] p-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7d876d]">
              O que vem neste kit:
            </p>
            <ul className="mt-2.5 space-y-2">
              {project.includedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 font-sans text-xs font-light text-[#8b4114]/85">
                  <Check className="h-4 w-4 shrink-0 text-[#7d876d]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botão de Compra / WhatsApp */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onAddToCart(project);
                onClose();
              }}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#7d876d] px-5 font-sans text-xs font-medium text-white shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao pedido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
