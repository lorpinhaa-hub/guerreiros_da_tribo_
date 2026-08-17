import React, { useEffect, useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

export default function Galeria() {
  const [fotos, setFotos] = useState(null);

  useEffect(() => {
    base44.entities.FotoGaleria
      .list("-created_date", 50)
      .then(setFotos)
      .catch(() => setFotos([]));
  }, []);

  if (fotos === null) {
    return (
      <div className="flex items-center justify-center py-20 text-white/80">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando fotos...
      </div>
    );
  }

  if (!fotos.length) {
    return (
      <p className="text-center text-white/70 py-16">Nenhuma foto na galeria ainda.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {fotos.map((foto) => (
        <div
          key={foto.id}
          className="rounded-xl overflow-hidden bg-[#005A20] border border-[#2E8B57]/40 shadow"
        >
          <div className="aspect-square bg-[#007A2E] flex items-center justify-center">
            {foto.imagem_url ? (
              <Image
                src={foto.imagem_url}
                alt={foto.titulo}
                fittingType="fill"
                className="w-full h-full"
              />
            ) : (
              <ImageIcon className="w-10 h-10 text-[#2E8B57]" />
            )}
          </div>
          <p className="text-white text-sm font-medium px-2.5 py-2 leading-snug">
            {foto.titulo}
          </p>
        </div>
      ))}
    </div>
  );
}
