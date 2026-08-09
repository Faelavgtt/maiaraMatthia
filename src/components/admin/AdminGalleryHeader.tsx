export function AdminGalleryHeader({ statusMessage, productsCount }: { statusMessage: string; productsCount: number }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="font-sans text-xs font-normal uppercase tracking-[0.18em] text-[#76877e]">Galeria</p>
        <h1 className="font-sans text-2xl font-light text-[#8b4114] md:text-3xl">Cadastrar produto na galeria</h1>
        <p className="mt-1 max-w-2xl rounded-md border border-[#8b4114]/15 bg-white px-3 py-1.5 font-sans text-xs font-light leading-5 text-[#8b4114]/70">
          {statusMessage}
        </p>
      </div>

      <div className="rounded-md border border-[#8b4114]/15 bg-white px-5 py-3 shadow-[0_10px_24px_rgba(93,51,29,0.06)]">
        <p className="font-sans text-xs font-normal uppercase tracking-[0.16em] text-[#76877e]">Produtos no carrossel</p>
        <p className="mt-1 font-sans text-3xl font-light text-[#8b4114]">{productsCount}</p>
      </div>
    </div>
  );
}
