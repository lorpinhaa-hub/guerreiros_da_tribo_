import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Copy, Check, QrCode, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const PIX_KEY = "guerreiros-da-tribo-pix-9f3a7c2e1b4d5f8a6e0c2d7b9a1f3e5c";
const BENEFICIARIO = "Guerreiros da Tribo - Guarani F.C.";
const CIDADE = "CAMPINAS";

const buildPixPayload = (key, nome, cidade) => {
  const tlv = (id, val) => id + val.length.toString().padStart(2, "0") + val;
  const gui = tlv("00", "BR.GOV.BCB.PIX");
  const keyField = tlv("01", key);
  const mai = tlv("26", gui + keyField);
  const merchant = tlv("59", nome.slice(0, 25));
  const city = tlv("60", cidade.slice(0, 15));
  const additional = tlv("62", tlv("05", "***"));
  const base =
    tlv("00", "01") +
    tlv("01", "11") +
    mai +
    tlv("52", "0000") +
    tlv("53", "986") +
    merchant +
    city +
    additional +
    "6304";
  let crc = 0xffff;
  for (let i = 0; i < base.length; i++) {
    crc ^= base.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return base + crc.toString(16).toUpperCase().padStart(4, "0");
};

const COPIA_E_COLA = buildPixPayload(PIX_KEY, BENEFICIARIO, CIDADE);

const PLANOS = [
  { id: "mensal", label: "Mensal", valor: 30 },
  { id: "trimestral", label: "Trimestral", valor: 80 },
  { id: "semestral", label: "Semestral", valor: 150 },
  { id: "anual", label: "Anual", valor: 280 },
];

export default function Pagamentos() {
  const [user, setUser] = useState(null);
  const [plano, setPlano] = useState(PLANOS[0]);
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=ffffff&color=005A20&margin=8&data=${encodeURIComponent(
    COPIA_E_COLA
  )}`;

  const copyCopiaCola = async () => {
    try {
      await navigator.clipboard.writeText(COPIA_E_COLA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    } catch (_) {}
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20 text-white/80">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-white/70 text-xs font-bold mb-2">ESCOLHA O PLANO</p>
        <div className="grid grid-cols-2 gap-2">
          {PLANOS.map((p) => {
            const ativo = plano.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlano(p)}
                className={`rounded-xl p-3 border transition text-left ${
                  ativo
                    ? "bg-[#2E8B57] border-[#9CE5B5]"
                    : "bg-[#005A20] border-[#2E8B57]/40"
                }`}
              >
                <p className="text-white font-bold text-sm">{p.label}</p>
                <p className="text-white/80 text-lg font-extrabold leading-none mt-1">
                  R$ {p.valor}
                  <span className="text-xs font-normal text-white/60">,00</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 flex flex-col items-center shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-4 h-4 text-[#005A20]" />
          <p className="text-[#005A20] font-bold text-sm">Pague com PIX</p>
        </div>
        <img src={qrSrc} alt="QR Code PIX" className="w-56 h-56 my-1" />
        <p className="text-[#005A20] font-extrabold text-2xl">R$ {plano.valor},00</p>
        <p className="text-[#005A20]/70 text-xs">{plano.label} • {BENEFICIARIO}</p>

        <Button
          onClick={copyCopiaCola}
          className="w-full mt-4 bg-[#2E8B57] hover:bg-[#35996a] h-11 text-sm font-bold gap-2"
        >
          {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> PIX Copia e Cola</>}
        </Button>
      </div>

      <div className="rounded-2xl bg-[#005A20] border border-[#2E8B57]/40 p-4">
        <p className="text-white/70 text-xs font-bold mb-2 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" /> CHAVE PIX ALEATÓRIA
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-[#007A2E] rounded-lg px-3 py-2.5 text-white text-xs font-mono break-all">
            {PIX_KEY}
          </code>
          <button
            onClick={copyKey}
            className="shrink-0 bg-[#2E8B57] hover:bg-[#35996a] text-white rounded-lg p-2.5"
          >
            {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-white/50 text-xs mt-2">
          Beneficiário: {BENEFICIARIO} • {CIDADE}
        </p>
      </div>

      <div className="rounded-2xl bg-[#005A20] border border-[#2E8B57]/40 p-4">
        <p className="text-white/70 text-xs font-bold mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> STATUS DO PAGAMENTO
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">{user.full_name || user.email}</p>
            <p className="text-white/50 text-xs">Plano selecionado: {plano.label}</p>
          </div>
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
            Ag. confirmação
          </span>
        </div>
        <p className="text-white/50 text-xs mt-3">
          Após pagar, envie o comprovante para <span className="text-[#9CE5B5] font-semibold">sociosgto@gmail.com</span> para confirmação do plano.
        </p>
      </div>
    </div>
  );
}
