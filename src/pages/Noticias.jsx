import React from "react";
import { Newspaper } from "lucide-react";

export default function Noticias() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#005A20] border border-[#2E8B57]/40 mb-5">
        <Newspaper className="w-10 h-10 text-[#9CE5B5]" />
      </div>
      <h2 className="text-white text-xl font-bold">Em breve novidades!</h2>
      <p className="text-white/70 text-sm mt-2 max-w-xs">
        Espaço reservado para notícias do clube, jogos, resultados e avisos da torcida.
      </p>
    </div>
  );
}
