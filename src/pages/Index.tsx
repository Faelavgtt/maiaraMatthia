import { FormEvent, useState } from "react";
import { Footer } from "@/components/landing/Footer";
import { FeedbacksSection } from "@/components/landing/FeedbacksSection";
import { FamilinhaSection } from "@/components/landing/FamilinhaSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MakerSection } from "@/components/landing/MakerSection";
import { OrderSection } from "@/components/landing/OrderSection";
import { OtherProjectsSection } from "@/components/landing/OtherProjectsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { WorkShowcaseSection } from "@/components/landing/WorkShowcaseSection";

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

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const projectType = String(data.get("projectType") ?? "");
    const projectIdea = String(data.get("projectIdea") ?? "");
    const deadline = String(data.get("deadline") ?? "");
    const references = String(data.get("references") ?? "");

    const message = [
      "Ola! Quero pedir um orcamento com a Maiara Mattia.",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Tipo de projeto: ${projectType || "a definir"}`,
      `Ideia inicial: ${projectIdea || "a conversar"}`,
      `Prazo ou data: ${deadline || "sem prazo definido"}`,
      `Referencias/arquivo: ${references || uploadFileName || "posso enviar depois"}`,
      `Observacoes: ${designerNotes || "sem observacoes"}`,
    ].join("\n");

    setWhatsappUrl(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  return (
    <main className="min-h-screen bg-[#ddb8a6] text-[#8b4114]">
      <Header />
      <HeroSection phrase={title} />
      <WorkShowcaseSection />
      <FamilinhaSection />
      <GallerySection />
      <OtherProjectsSection />
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
      <FeedbacksSection />

      <OrderSection whatsappUrl={whatsappUrl} onSubmit={submitOrder} />
      <Footer />
    </main>
  );
};

export default Index;
