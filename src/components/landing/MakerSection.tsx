import { ChangeEvent, ReactNode } from "react";
import { Check, Send, Upload } from "lucide-react";

const backgroundOptions = [
  { name: "Branco", value: "#ffffff" },
  { name: "Rosa chá", value: "#ddb8a6" },
  { name: "Argila", value: "#d39a7e" },
  { name: "Terracota", value: "#c68043" },
  { name: "Oliva", value: "#979f8a" },
  { name: "Verde folha", value: "#7d876d" },
];

const outlineOptions = [
  { name: "Marrom", value: "#8b4114" },
  { name: "Preto suave", value: "#000000" },
  { name: "Branco", value: "#ffffff" },
  { name: "Terracota", value: "#c68043" },
  { name: "Verde folha", value: "#7d876d" },
];

const exampleOptions = [
  {
    id: "caveirinha",
    label: "Caveirinha",
    caption: "Maria Flor Moretto, 3 anos",
    title: "CAVEIRINHA",
    subtitle: "Maria Flor Moretto, 3 anos",
  },
  {
    id: "menino",
    label: "O menino",
    caption: "Martin Moretto, 3 anos",
    title: "O MENINO",
    subtitle: "Martin Moretto, 3 anos",
  },
];

const svgExamples: Record<string, { src: string; label: string; sizeClass: string }> = {
  caveirinha: {
    src: "/image/desenhos/caveirinha.svg",
    label: "Caveirinha",
    sizeClass: "inset-8 md:inset-10",
  },
  menino: {
    src: "/image/desenhos/oMenino.svg",
    label: "O menino",
    sizeClass: "inset-5 md:inset-7",
  },
};

type MakerSectionProps = {
  backgroundColor: string;
  outlineColor: string;
  orientation: "portrait" | "landscape";
  size: "small" | "medium" | "large";
  title: string;
  subtitle: string;
  designerNotes: string;
  selectedExample: string;
  uploadFileName: string;
  onBackgroundColorChange: (value: string) => void;
  onOutlineColorChange: (value: string) => void;
  onOrientationChange: (value: "portrait" | "landscape") => void;
  onSizeChange: (value: "small" | "medium" | "large") => void;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onDesignerNotesChange: (value: string) => void;
  onExampleChange: (value: string) => void;
  onUploadFileNameChange: (value: string) => void;
};

export function MakerSection({
  backgroundColor,
  outlineColor,
  orientation,
  size,
  title,
  subtitle,
  designerNotes,
  selectedExample,
  uploadFileName,
  onBackgroundColorChange,
  onOutlineColorChange,
  onOrientationChange,
  onSizeChange,
  onTitleChange,
  onSubtitleChange,
  onDesignerNotesChange,
  onExampleChange,
  onUploadFileNameChange,
}: MakerSectionProps) {
  const selectedBackground = backgroundOptions.find((option) => option.value === backgroundColor)?.name ?? "Personalizado";
  const selectedOutline = outlineOptions.find((option) => option.value === outlineColor)?.name ?? "Personalizado";
  const selectedArtwork = exampleOptions.find((example) => example.id === selectedExample) ?? exampleOptions[0];

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onUploadFileNameChange(file?.name ?? "");
  };

  const selectExample = (example: (typeof exampleOptions)[number]) => {
    onExampleChange(example.id);
  };

  return (
    <section id="maker" className="relative overflow-hidden bg-[#7d876d]">
      <img src="/image/elementoFlor.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-28 h-80 w-80 -rotate-12 opacity-20 mix-blend-soft-light md:-bottom-44 md:-right-36 md:h-[34rem] md:w-[34rem] " />
      <div className="mx-auto max-w-screen-2xl px-5 py-5 ">
        <div className="mb-6 max-w-5xl ">
          <p className="font-sans text-xs font-normal uppercase tracking-[0.22em] text-white">Maker de pedido</p>
          <h2 className="mt-1 font-sans text-3xl font-extralight leading-tight text-white md:text-4xl">
            Monte a ideia do quadro em poucos cliques.
          </h2>
          <p className="mt-3 font-sans text-base font-light leading-7 text-white md:text-lg">
            Escolha o fundo, a cor do traço, o formato, o tamanho e envie o desenho da criança. A finalização continua pelo WhatsApp.
          </p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <div>
            <div className="rounded-xl border border-white/35 bg-white p-4 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
              <p className="mb-3 text-center font-sans text-[11px] font-light uppercase tracking-[0.14em] text-[#8b4114]/70">
                Exemplo de como irá ficar
              </p>
              <div className="flex min-h-[430px] items-center justify-center rounded-lg bg-[#ddb8a6]/35 p-4">
                <div className={`rounded-md bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] ${orientation === "portrait" ? "w-full max-w-[330px]" : "w-full max-w-[470px]"}`}>
                  <div className={`bg-white p-5 ${orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                    <div className="flex h-full flex-col">
                      <div
                        className="relative flex-1 overflow-hidden"
                        style={{ backgroundColor }}
                      >
                        <SketchPreview outlineColor={outlineColor} selectedExample={selectedExample} />
                      </div>
                      <div className="flex min-h-[86px] flex-col items-center justify-center bg-white px-4 py-4 text-center text-black">
                        <p className="font-poppins text-lg font-normal leading-none tracking-wide">
                          "{selectedArtwork.title}"
                        </p>
                        <p className="mt-2 font-poppins text-sm font-normal leading-tight">
                          {selectedArtwork.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {exampleOptions.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => selectExample(example)}
                  className={`h-11 rounded-full border px-4 font-sans text-sm font-light ${
                    selectedExample === example.id
                      ? "border-[#8b4114] bg-[#ddb8a6] text-[#8b4114]"
                      : "border-[#ddb8a6] bg-white text-[#8b4114]"
                  }`}
                  title={example.caption}
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/35 bg-white p-4 shadow-[0_18px_48px_rgba(0,0,0,0.10)] md:p-5">
            <div className="grid gap-x-6 gap-y-1 lg:grid-cols-2 2xl:grid-cols-3">
            <ConfigBlock title="Cor do fundo">
              <div className="flex flex-wrap gap-2">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onBackgroundColorChange(option.value)}
                    className={`h-10 w-10 rounded-full border ${backgroundColor === option.value ? "border-[#8b4114] ring-2 ring-[#8b4114]/25" : "border-[#ddb8a6]"}`}
                    style={{ backgroundColor: option.value }}
                    aria-label={`Selecionar fundo ${option.name}`}
                  />
                ))}
              </div>
              <p className="mt-2 font-sans text-xs font-light text-[#8b4114]">Sua cor: {selectedBackground}</p>
            </ConfigBlock>

            <ConfigBlock title="Cor do traço">
              <div className="flex flex-wrap gap-2">
                {outlineOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onOutlineColorChange(option.value)}
                    className={`h-10 w-10 rounded-full border ${outlineColor === option.value ? "border-[#8b4114] ring-2 ring-[#8b4114]/25" : "border-[#ddb8a6]"}`}
                    style={{ backgroundColor: option.value }}
                    aria-label={`Selecionar traço ${option.name}`}
                    title={option.name}
                  />
                ))}
              </div>
              <p className="mt-2 font-sans text-xs font-light text-[#8b4114]">Selecionado: {selectedOutline}</p>
            </ConfigBlock>

            <ConfigBlock title="Orientação">
              <div className="flex flex-wrap gap-3">
                <OptionButton active={orientation === "portrait"} onClick={() => onOrientationChange("portrait")}>Retrato</OptionButton>
                <OptionButton active={orientation === "landscape"} onClick={() => onOrientationChange("landscape")}>Paisagem</OptionButton>
              </div>
            </ConfigBlock>

            <ConfigBlock title="Tamanho">
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <RadioLine active={size === "small"} onClick={() => onSizeChange("small")} label="Pequeno" detail="A4 digital" />
                <RadioLine active={size === "medium"} onClick={() => onSizeChange("medium")} label="Médio" detail="A3 digital" />
                <RadioLine active={size === "large"} onClick={() => onSizeChange("large")} label="Grande" detail="Alta resolução" />
              </div>
            </ConfigBlock>

            <ConfigBlock title="Título pessoal" className="lg:col-span-2 2xl:col-span-2">
              <div className="grid gap-3 sm:grid-cols-2">
              <input
                onChange={(event) => onTitleChange(event.target.value)}
                className="h-10 w-full rounded-full border border-[#ddb8a6] px-4 font-sans text-sm font-light outline-none placeholder:text-[#8b4114]/45 focus:border-[#8b4114]"
                placeholder="Ex: O mundo da Lia"
              />
              <input
                onChange={(event) => onSubtitleChange(event.target.value)}
                className="h-10 w-full rounded-full border border-[#ddb8a6] px-4 font-sans text-sm font-light outline-none placeholder:text-[#8b4114]/45 focus:border-[#8b4114]"
                placeholder="Ex: primeiro desenho de 2026"
              />
              </div>
            </ConfigBlock>

            <ConfigBlock title="Desenho da criança">
              <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#8b4114]/50 bg-[#ddb8a6]/45 px-4 py-3 text-center font-sans text-xs font-light text-[#8b4114]">
                <Upload className="h-4 w-4 shrink-0" />
                {uploadFileName || "Enviar foto do desenho"}
                <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleUpload} />
              </label>
            </ConfigBlock>

            <ConfigBlock title="Info para a designer" className="2xl:col-span-2">
              <textarea
                value={designerNotes}
                onChange={(event) => onDesignerNotesChange(event.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-[#ddb8a6] p-3 font-sans text-sm font-light outline-none placeholder:text-[#8b4114]/45 focus:border-[#8b4114]"
                placeholder="Ex: manter o sol, remover rabiscos do canto, usar a frase exatamente assim..."
              />
            </ConfigBlock>

            <ConfigBlock title="Incluso" className="lg:col-span-2 2xl:col-span-3">
              <div className="grid gap-2 font-sans text-xs font-light leading-snug text-[#8b4114] sm:grid-cols-3">
                <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" /> Prévia por WhatsApp</p>
                <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" /> Arquivo para impressão</p>
                <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0" /> Ajuste manual</p>
              </div>
            </ConfigBlock>

            <div className="flex justify-end pt-3 lg:col-span-2 2xl:col-span-3 z-10">
              <a
                href="#pedido"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#8b4114] px-5 font-sans text-xs font-medium text-white shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5"
              >
                Enviar pedido
                <Send className="h-4 w-4" />
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConfigBlock({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`border-b border-[#ddb8a6]/80 py-3.5 ${className}`}>
      <h3 className="mb-2.5 font-sans text-[10px] font-normal uppercase leading-none tracking-[0.16em] text-[#8b4114]">{title}</h3>
      {children}
    </div>
  );
}

function OptionButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-full border px-4 font-sans text-xs font-light ${
        active ? "border-[#8b4114] bg-[#ddb8a6] text-[#8b4114]" : "border-[#ddb8a6] bg-white text-[#8b4114]"
      }`}
    >
      {children}
    </button>
  );
}

function RadioLine({ active, onClick, label, detail }: { active: boolean; onClick: () => void; label: string; detail: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-start gap-2 text-left">
      <span className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#8b4114] ${active ? "bg-[#8b4114]" : "bg-white"}`}>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span>
        <span className="block font-sans text-[13px] font-medium leading-tight text-[#8b4114]">{label}</span>
        <span className="block font-sans text-[11px] font-light leading-snug text-[#8b4114]">{detail}</span>
      </span>
    </button>
  );
}

function SketchPreview({ outlineColor, selectedExample }: { outlineColor: string; selectedExample: string }) {
  const svgExample = svgExamples[selectedExample];

  if (svgExample) {
    return <SvgTracePreview outlineColor={outlineColor} example={svgExample} />;
  }

  return (
    <div className="absolute inset-10">
      <div className="absolute left-12 top-16 h-40 w-44 rounded-[40%] border-2" style={{ borderColor: outlineColor }} />
      <div className="absolute left-20 top-28 h-16 w-10 rounded-full border-2" style={{ borderColor: outlineColor }} />
      <div className="absolute right-16 top-24 h-24 w-24 rounded-[45%] border-2" style={{ borderColor: outlineColor }} />
      <div className="absolute bottom-24 left-16 h-12 w-40 rounded-b-full border-b-2" style={{ borderColor: outlineColor }} />
      <div className="absolute left-24 top-20 h-20 rotate-[-18deg] border-l-2" style={{ borderColor: outlineColor }} />
    </div>
  );
}

function SvgTracePreview({
  outlineColor,
  example,
}: {
  outlineColor: string;
  example: { src: string; label: string; sizeClass: string };
}) {
  return (
    <div className={`absolute ${example.sizeClass}`}>
      <div
        aria-label={`Prévia do desenho ${example.label}`}
        role="img"
        className="h-full w-full bg-current"
        style={{
          color: outlineColor,
          WebkitMaskImage: `url("${example.src}")`,
          maskImage: `url("${example.src}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </div>
  );
}
