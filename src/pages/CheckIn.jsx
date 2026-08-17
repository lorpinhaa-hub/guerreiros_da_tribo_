import React, { useEffect, useState } from "react";
import { Loader2, MapPin, Calendar, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function CheckIn() {
  const [eventos, setEventos] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    base44.entities.Evento
      .list("-created_date", 50)
      .then(setEventos)
      .catch(() => setEventos([]));
  }, []);

  if (eventos === null) {
    return (
      <div className="flex items-center justify-center py-20 text-white/80">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando eventos...
      </div>
    );
  }

  const handleSelectEvento = async (ev) => {
    setSelecionado(ev);
    setEmailSent(false);
    if (user?.email) {
      try {
        await base44.integrations.Core.SendEmail({
          to: user.email,
          subject: `✅ Check-in confirmado: ${ev.nome}`,
          body: `Olá, Guerreiro!\n\nSeu check-in foi confirmado para o evento:\n\n📌 ${ev.nome}\n📍 Local: ${ev.local}\n📅 Data: ${ev.data}\n\nApresente seu QR Code na entrada. Vamos juntos!\n\nGuerreiros da Tribo 💚 Guarani F.C.`,
        });
        setEmailSent(true);
      } catch (_) {}
    }
  };

  const qrPayload = selecionado
    ? `${selecionado.nome}|${selecionado.local}|${selecionado.data}|${Date.now()}`
    : "";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&bgcolor=ffffff&color=005A20&margin=8&data=${encodeURIComponent(
    qrPayload
  )}`;

  return (
    <div className="space-y-5">
      <p className="text-white/80 text-sm">
        Selecione o evento para fazer check-in:
      </p>

      <div className="space-y-3">
        {eventos.map((ev) => {
          const ativo = selecionado?.id === ev.id;
          return (
            <button
            key={ev.id}
            onClick={() => handleSelectEvento(ev)}
              className={`w-full text-left rounded-xl p-4 border transition active:scale-[0.98] ${
                ativo
                  ? "bg-[#2E8B57] border-[#9CE5B5]"
                  : "bg-[#005A20] border-[#2E8B57]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    ativo ? "border-white bg-white" : "border-white/60"
                  }`}
                >
                  {ativo && <span className="w-2.5 h-2.5 rounded-full bg-[#005A20]" />}
                </span>
                <div className="min-w-0">
                  <p className="text-white font-bold leading-tight">{ev.nome}</p>
                  <div className="text-white/75 text-xs mt-1 space-y-0.5">
                    <p>{ev.tipo} • {ev.local}</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {ev.data}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selecionado && (
        <div className="rounded-2xl bg-white p-5 flex flex-col items-center shadow-2xl">
          <p className="text-[#005A20] font-bold text-sm mb-1">
            Seu QR Code de check-in:
          </p>
          <img
            src={qrSrc}
            alt="QR Code de check-in"
            className="w-60 h-60 my-2"
          />
          <p className="text-[#005A20] font-extrabold text-center text-base leading-tight">
            {selecionado.nome}
          </p>
          <div className="text-[#005A20]/70 text-xs mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {selecionado.local} • {selecionado.data}
          </div>
          {emailSent && (
            <div className="mt-3 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-green-700 text-xs">Confirmação enviada para seu e-mail!</p>
            </div>
          )}
        </div>
      )}

      {eventos.length === 0 && (
        <p className="text-center text-white/70 py-10">Nenhum evento disponível.</p>
      )}
    </div>
  );
}
