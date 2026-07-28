import { ImagePlus, Images, Upload } from "lucide-react";

const photoSlots = [
  { label: "Hero / retrato", path: "/image/maiara.jpeg", description: "Imagem principal da Maiara no topo do site." },
  { label: "Portfolio 01", path: "/image/desenhos/desenhos.jpeg", description: "Projeto exibido na galeria de artes." },
  { label: "Portfolio 02", path: "/image/desenhos/desenhos2.jpeg", description: "Outra imagem para a vitrine do site." },
  { label: "Feedback 01", path: "/image/feedbacks/feedback1.png", description: "Print usado na secao de feedbacks." },
];

const AdminPhotos = () => {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Fotos do site</p>
            <h1 className="font-sans text-3xl font-extralight text-[#8b4114] md:text-4xl">Imagens que aparecem no site</h1>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Primeira estrutura para trocar fotos da home, portfolio e feedbacks. Por enquanto os cards mostram os arquivos atuais e deixam o fluxo de upload desenhado.
            </p>
          </div>

          <div className="rounded-md border border-[#8b4114]/15 bg-white/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#7d876d] text-white">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-[#8b4114]">Upload em breve</p>
                <p className="font-sans text-xs font-light leading-5 text-[#8b4114]/65">
                  A proxima etapa e ligar este front ao armazenamento das imagens.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {photoSlots.map((slot) => (
            <article key={slot.label} className="overflow-hidden rounded-md border border-[#8b4114]/15 bg-white shadow-[0_14px_34px_rgba(93,51,29,0.08)]">
              <div className="relative aspect-[4/5] bg-[#f0dfd4]">
                <img src={slot.path} alt={slot.label} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm font-medium text-[#8b4114]">{slot.label}</p>
                    <p className="mt-1 font-sans text-xs font-light leading-5 text-[#8b4114]/65">{slot.description}</p>
                  </div>
                  <Images className="h-4 w-4 shrink-0 text-[#76877e]" />
                </div>
                <label className="mt-4 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ddb8a6] bg-[#fffaf5] px-4 font-sans text-xs font-light text-[#8b4114] transition-colors hover:bg-[#f8f1e9]">
                  <ImagePlus className="h-4 w-4" />
                  Trocar imagem
                  <input type="file" accept="image/*" className="sr-only" disabled />
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPhotos;
