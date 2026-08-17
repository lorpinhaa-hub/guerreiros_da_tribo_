import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Images, QrCode, Users, ShieldCheck, CalendarDays, CreditCard } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MENU_BASE = [
  { to: "/noticias", label: "NOTÍCIAS", icon: Newspaper, desc: "Novidades e avisos do clube" },
  { to: "/calendario", label: "CALENDÁRIO", icon: CalendarDays, desc: "Jogos e eventos por data" },
  { to: "/galeria", label: "GALERIA", icon: Images, desc: "Fotos do time e eventos" },
  { to: "/check-in", label: "CHECK-IN", icon: QrCode, desc: "QR Code para eventos" },
  { to: "/pagamentos", label: "PAGAMENTOS", icon: CreditCard, desc: "Mensalidades via PIX" },
  { to: "/socios", label: "SÓCIOS", icon: Users, desc: "Lista de associados" },
];

export default function Inicio() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(MENU_BASE);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      if (u?.role === "admin") {
        setMenu([...MENU_BASE, { to: "/admin", label: "ADMIN", icon: ShieldCheck, desc: "Painel administrativo" }]);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#005A20] border border-[#2E8B57]/40 p-5 shadow-lg">
        <p className="text-white/70 text-sm">Bem-vindo,</p>
        <p className="text-white text-xl font-bold truncate">
          {user?.full_name || user?.email || "Guerreiro"}
        </p>
        <p className="text-[#9CE5B5] text-sm font-medium mt-1">
          Guerreiros da Tribo 💚
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {menu.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl bg-[#005A20] border border-[#2E8B57]/40 p-5 flex flex-col items-start gap-3 shadow-lg active:scale-95 transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#2E8B57] group-active:bg-[#35996a] transition">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold tracking-wide">{label}</p>
              <p className="text-white/70 text-xs leading-snug mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
