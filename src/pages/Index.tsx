import { FormEvent, useMemo, useState } from "react";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MakerSection } from "@/components/landing/MakerSection";
import { OrderSection } from "@/components/landing/OrderSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StudioSection } from "@/components/landing/StudioSection";

const Index = () => {
  const [backgroundColor, setBackgroundColor] = useState("#ddb8a6");
  const [outlineColor, setOutlineColor] = useState("#8b4114");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [title, setTitle] = useState("CAVEIRINHA");
  const [subtitle, setSubtitle] = useState("Maria Flor Moretto, 3 anos");
  const [designerNotes, setDesignerNotes] = useState("");
  const [selectedExample, setSelectedExample] = useState("caveirinha");
  const [uploadFileName, setUploadFileName] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const makerSummary = useMemo(
    () => [
      `Fundo: ${backgroundColor}`,
      `Traço: ${outlineColor}`,
      `Formato: ${orientation === "portrait" ? "retrato" : "paisagem"}`,
      `Tamanho: ${size}`,
    ].join(" · "),
    [backgroundColor, outlineColor, orientation, size],
  );

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const message = [
      "Olá! Quero encomendar uma arte infantil em giz/aquarela.",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Título: ${title || "sem título"}`,
      `Subtítulo: ${subtitle || "sem subtítulo"}`,
      makerSummary,
      `Arquivo: ${uploadFileName || "a enviar"}`,
      `Observações para a designer: ${designerNotes || "sem observações"}`,
      "Valor fixo: R$ 129,00",
    ].join("\n");

    setWhatsappUrl(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  return (
    <main className="min-h-screen bg-[#ddb8a6] text-[#8b4114]">
      <Header />
      <HeroSection phrase={title} />
      <StudioSection />
      <PortfolioSection />
      <ServicesSection />
      <MakerSection
        backgroundColor={backgroundColor}
        outlineColor={outlineColor}
        orientation={orientation}
        size={size}
        title={title}
        subtitle={subtitle}
        designerNotes={designerNotes}
        selectedExample={selectedExample}
        uploadFileName={uploadFileName}
        onBackgroundColorChange={setBackgroundColor}
        onOutlineColorChange={setOutlineColor}
        onOrientationChange={setOrientation}
        onSizeChange={setSize}
        onTitleChange={setTitle}
        onSubtitleChange={setSubtitle}
        onDesignerNotesChange={setDesignerNotes}
        onExampleChange={setSelectedExample}
        onUploadFileNameChange={setUploadFileName}
      />
      <ProcessSection />
      <OrderSection
        title={title}
        subtitle={subtitle}
        makerSummary={makerSummary}
        whatsappUrl={whatsappUrl}
        onSubmit={submitOrder}
      />
      <Footer />
    </main>
  );
};

export default Index;
