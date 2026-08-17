import React, { useEffect, useState } from "react";
import { Loader2, Users, Mail, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Socios() {
  const [socios, setSocios] = useState(null);

  useEffect(() => {
    base44.entities.Socio
      .list("-created_date", 100)
      .then(setSocios)
      .catch(() => setSocios([]));
  }, []);

  if (socios === null) {
    return (
      <div className="flex items-center justify-center py-20 text-white/80">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando sócios...
      </div>
    );
  }

  if (!socios.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#005A20] border border-[#2E8B57]/40 mb-5">
          <Users className="w-10 h-10 text-[#9CE5B5]" />
        </div>
        <h2 className="text-white text-lg font-bold">Lista de sócios em construção</h2>
        <p className="text-white/70 text-sm mt-2 max-w-xs">
          Os associados cadastrados aparecerão aqui em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-white/80 text-sm">
        {socios.length} sócio{socios.length > 1 ? "s" : ""} cadastrado{socios.length > 1 ? "s" : ""}
      </p>
      {socios.map((s) => (
        <div
          key={s.id}
          className="rounded-xl bg-[#005A20] border border-[#2E8B57]/40 p-4 shadow"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#2E8B57] shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold leading-tight truncate">{s.nome}</p>
              <p className="text-white/75 text-xs flex items-center gap-1 mt-0.5 truncate">
                <Mail className="w-3 h-3 shrink-0" /> {s.email}
              </p>
              {s.telefone && (
                <p className="text-white/75 text-xs flex items-center gap-1 truncate">
                  <Phone className="w-3 h-3 shrink-0" /> {s.telefone}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
