import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Users, Calendar, Images, Trash2, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOGO_URL = "https://media.base44.com/images/public/6a7ce15ca66c6e3ed58f020a/5f0bb2871_LOGOOFICIAL.jpg";

const TAB = { socios: "socios", eventos: "eventos", galeria: "galeria" };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState(TAB.socios);
  const [socios, setSocios] = useState(null);
  const [eventos, setEventos] = useState(null);
  const [fotos, setFotos] = useState(null);
  const [form, setForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => { loadTab(); }, [tab]);

  const loadTab = async () => {
    if (tab === TAB.socios) {
      setSocios(null);
      setSocios(await base44.entities.Socio.list("-created_date", 200));
    } else if (tab === TAB.eventos) {
      setEventos(null);
      setEventos(await base44.entities.Evento.list("-created_date", 100));
    } else {
      setFotos(null);
      setFotos(await base44.entities.FotoGaleria.list("-created_date", 200));
    }
    setAdding(false);
    setForm({});
    setMsg("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20 text-white/80">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <img src={LOGO_URL} alt="GTO" className="w-16 h-16 rounded-full mb-4" />
        <p className="text-white font-bold text-lg">Acesso restrito</p>
        <p className="text-white/70 text-sm mt-1">Apenas administradores podem acessar esta área.</p>
      </div>
    );
  }

  const handleDelete = async (entity, id) => {
    if (!window.confirm("Confirmar exclusão?")) return;
    await base44.entities[entity].delete(id);
    loadTab();
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      if (tab === TAB.eventos) {
        await base44.entities.Evento.create(form);
      } else if (tab === TAB.galeria) {
        await base44.entities.FotoGaleria.create(form);
      }
      setMsg("Salvo com sucesso!");
      loadTab();
    } catch (e) {
      setMsg("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: TAB.socios, label: "Sócios", icon: Users },
    { key: TAB.eventos, label: "Eventos", icon: Calendar },
    { key: TAB.galeria, label: "Galeria", icon: Images },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#005A20] border border-[#2E8B57]/40 p-4 flex items-center gap-3">
        <img src={LOGO_URL} alt="GTO" className="w-10 h-10 rounded-full object-cover border border-white/30" />
        <div>
          <p className="text-white font-bold text-sm">Painel Admin</p>
          <p className="text-white/60 text-xs">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition ${
              tab === key ? "bg-[#2E8B57] text-white" : "bg-[#005A20] text-white/70"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === TAB.socios && (
        <div className="space-y-2">
          <p className="text-white/70 text-sm">{socios?.length ?? "..."} sócios cadastrados</p>
          {socios === null ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>
          ) : socios.map((s) => (
            <div key={s.id} className="rounded-xl bg-[#005A20] border border-[#2E8B57]/40 p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{s.nome}</p>
                <p className="text-white/60 text-xs truncate">{s.email}</p>
                {s.telefone && <p className="text-white/60 text-xs">{s.telefone}</p>}
              </div>
              <button onClick={() => handleDelete("Socio", s.id)} className="text-red-400 hover:text-red-300 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === TAB.eventos && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-sm">{eventos?.length ?? "..."} eventos</p>
            <button onClick={() => { setAdding(!adding); setForm({}); setMsg(""); }}
              className="flex items-center gap-1 text-xs font-bold text-[#9CE5B5] bg-[#005A20] border border-[#2E8B57]/40 rounded-lg px-3 py-1.5">
              {adding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {adding ? "Cancelar" : "Novo evento"}
            </button>
          </div>

          {adding && (
            <div className="rounded-xl bg-[#005A20] border border-[#2E8B57]/60 p-4 space-y-3">
              {[
                { key: "nome", label: "Nome do evento", placeholder: "Ex: Jogo Guarani x..." },
                { key: "tipo", label: "Tipo", placeholder: "Ex: Jogo, Encontro" },
                { key: "local", label: "Local", placeholder: "Ex: Brinco de Ouro" },
                { key: "data", label: "Data", placeholder: "Ex: 15/08/2026" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-white text-xs">{label}</Label>
                  <Input
                    placeholder={placeholder}
                    value={form[key] || ""}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="h-10 bg-[#007A2E] border-[#2E8B57] text-white placeholder:text-white/40 text-sm"
                  />
                </div>
              ))}
              {msg && <p className="text-xs text-center text-[#9CE5B5]">{msg}</p>}
              <Button onClick={handleSave} disabled={saving} className="w-full bg-[#2E8B57] hover:bg-[#35996a] h-10 text-sm font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" />Salvar evento</>}
              </Button>
            </div>
          )}

          {eventos === null ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>
          ) : eventos.map((ev) => (
            <div key={ev.id} className="rounded-xl bg-[#005A20] border border-[#2E8B57]/40 p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{ev.nome}</p>
                <p className="text-white/60 text-xs">{ev.tipo} • {ev.local} • {ev.data}</p>
              </div>
              <button onClick={() => handleDelete("Evento", ev.id)} className="text-red-400 hover:text-red-300 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === TAB.galeria && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-sm">{fotos?.length ?? "..."} fotos</p>
            <button onClick={() => { setAdding(!adding); setForm({}); setMsg(""); }}
              className="flex items-center gap-1 text-xs font-bold text-[#9CE5B5] bg-[#005A20] border border-[#2E8B57]/40 rounded-lg px-3 py-1.5">
              {adding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {adding ? "Cancelar" : "Nova foto"}
            </button>
          </div>

          {adding && (
            <div className="rounded-xl bg-[#005A20] border border-[#2E8B57]/60 p-4 space-y-3">
              {[
                { key: "titulo", label: "Título", placeholder: "Ex: Torcida na arquibancada" },
                { key: "imagem_url", label: "URL da imagem", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-white text-xs">{label}</Label>
                  <Input
                    placeholder={placeholder}
                    value={form[key] || ""}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="h-10 bg-[#007A2E] border-[#2E8B57] text-white placeholder:text-white/40 text-sm"
                  />
                </div>
              ))}
              {form.imagem_url && (
                <img src={form.imagem_url} alt="preview" className="w-full h-32 object-cover rounded-lg" onError={(e) => e.target.style.display='none'} />
              )}
              {msg && <p className="text-xs text-center text-[#9CE5B5]">{msg}</p>}
              <Button onClick={handleSave} disabled={saving} className="w-full bg-[#2E8B57] hover:bg-[#35996a] h-10 text-sm font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" />Salvar foto</>}
              </Button>
            </div>
          )}

          {fotos === null ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {fotos.map((f) => (
                <div key={f.id} className="rounded-xl overflow-hidden bg-[#005A20] border border-[#2E8B57]/40 relative">
                  <img src={f.imagem_url} alt={f.titulo} className="w-full aspect-square object-cover" />
                  <div className="absolute top-1 right-1">
                    <button onClick={() => handleDelete("FotoGaleria", f.id)}
                      className="bg-black/60 rounded-full p-1 text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-white text-xs px-2 py-1.5 truncate">{f.titulo}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
