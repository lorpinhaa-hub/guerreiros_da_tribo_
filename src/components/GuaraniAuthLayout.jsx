import React from "react";

const LOGO_URL = "https://media.base44.com/images/public/6a7ce15ca66c6e3ed58f020a/5f0bb2871_LOGOOFICIAL.jpg";

export default function GuaraniAuthLayout({ children, titulo }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#004A1A]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img 
            src={LOGO_URL} 
            alt="Guerreiros da Tribo" 
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-[#2E8B57] object-cover"
          />
          <h1 className="text-2xl font-bold text-white">{titulo}</h1>
          <p className="text-white/60 text-sm mt-1">Guerreiros da Tribo — Guarani F.C.</p>
        </div>
        <div className="bg-[#005A20]/50 border border-[#2E8B57]/40 rounded-xl p-6 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
