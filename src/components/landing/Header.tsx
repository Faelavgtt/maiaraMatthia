import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      setHasScrolled(window.scrollY > 12);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-30 w-full transition-all duration-500 ${
        hasScrolled ? "bg-[#d19c88]/92 shadow-[0_10px_30px_rgba(93,51,29,0.08)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a href="#inicio" className="flex items-center gap-3 font-sans text-2xl font-light tracking-wide text-[#8b4114]">
          <img src="/logoMaiara.svg" alt="" className="h-12 w-auto" aria-hidden="true" />
        </a>
        <div className="hidden items-center gap-7 font-sans text-sm font-normal text-[#ffffff] md:flex">
          <a href="#portfolio">Projetos</a>
          <a href="#maker">Maker</a>
          <a href="#pedido">Pedido</a>
        </div>
        <a href="#pedido" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#7d876d] px-4 font-sans text-sm font-medium text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
          <MessageCircle className="h-4 w-4" />
          Encomendar
        </a>
      </nav>
    </header>
  );
}
