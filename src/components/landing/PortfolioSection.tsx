const projects = [
  { title: "Família em abraço", tag: "Retrato afetivo", palette: "bg-[#ddb8a6]/35" },
  { title: "Caderno encantado", tag: "Papelaria infantil", palette: "bg-[#979f8a]/35" },
  { title: "Chegada do bebê", tag: "Maternidade", palette: "bg-[#d39a7e]/35" },
  { title: "Primeiro rabisco", tag: "Memoria 1 a 5 anos", palette: "bg-[#c68043]/20" },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="section-shell relative overflow-hidden bg-[#ddb8a6]">
      
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2 className="mt-2 font-sans text-4xl font-extralight text-[#8b4114] md:text-5xl">Projetos com cara de primeira infância</h2>
        </div>
        <p className="max-w-xl font-sans text-lg font-light leading-7 text-[#8b4114]/85">
          Fundos claros, flores soltas, letras orgânicas, retratos carinhosos e pequenas cenas de criança sem contornos pesados.
        </p>
      </div>
      <div className="mx-auto mt-9 grid max-w-7xl gap-4 md:grid-cols-4">
        {projects.map((project, index) => (
          <article key={project.title} className="soft-card group overflow-hidden">
            <div className={`flex aspect-[4/5] items-center justify-center ${project.palette}`}>
              <div className="relative h-48 w-36 rounded-[46%_54%_50%_50%] border border-[#ddb8a6] bg-white/80 transition-transform group-hover:scale-105">
                <div className="absolute left-7 top-10 h-16 w-20 rounded-full border border-[#8b4114]/60" />
                <div className="absolute left-10 top-20 h-8 w-12 rounded-b-full border-b border-[#8b4114]/60" />
                <div className="absolute left-8 top-24 flex w-20 justify-between">
                  <span className="h-2 w-2 rounded-full bg-[#8b4114]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#8b4114]/70" />
                </div>
                <span className="absolute right-5 top-7 h-3 w-7 rotate-[-24deg] rounded-full bg-[#7d876d]/70" />
                <span className="absolute bottom-8 left-6 h-3 w-8 rotate-[18deg] rounded-full bg-[#ddb8a6]/80" />
              </div>
            </div>
            <div className="p-5">
              <span className="font-sans text-sm font-light text-[#7d876d]">{project.tag}</span>
              <h3 className="mt-1 font-sans text-2xl font-light text-[#8b4114]">{index + 1}. {project.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
