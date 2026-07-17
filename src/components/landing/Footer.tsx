import { Brush, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#ddb8a6] bg-[#8b4114] px-5 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-2xl font-light tracking-wide">Maiara Matthia</p>
        <p className="font-sans font-light text-white/75">Ilustração infantil, quadros personalizados e desenhos em linhas.</p>
        <div className="flex gap-2 text-[#ddb8a6]">
          <Heart className="h-5 w-5 fill-current" />
          <Brush className="h-5 w-5" />
        </div>
      </div>
    </footer>
  );
}

