import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CalendarDays, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEKDAYS = ["D","S","T","Q","Q","S","S"];

const parseDate = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim();
  let d;
  const br = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (br) {
    const day = +br[1], mon = +br[2];
    let yr = +br[3];
    if (br[3].length === 2) yr += 2000;
    d = new Date(yr, mon - 1, day);
  } else {
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) d = new Date(+iso[1], +iso[2]-1, +iso[3]);
  }
  if (!d || isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
};

const fmtKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const sameDay = (a, b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

export default function Calendario() {
  const [eventos, setEventos] = useState(null);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; });
  const [selected, setSelected] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });

  useEffect(() => {
    base44.entities.Evento.list("-created_date", 200).then(setEventos).catch(() => setEventos([]));
  }, []);

  const byDay = {};
  (eventos || []).forEach((ev) => {
    const d = parseDate(ev.data);
    if (!d) return;
    const key = fmtKey(d);
    (byDay[key] ||= []).push(ev);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = new Date(); today.setHours(0,0,0,0);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  const selectedEvents = byDay[fmtKey(selected)] || [];
  const upcomingEvents = (eventos || [])
    .map(ev => ({ ...ev, _date: parseDate(ev.data) }))
    .filter(ev => ev._date && ev._date >= today)
    .sort((a, b) => a._date - b._date);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#005A20] border border-[#2E8B57]/40 rounded-2xl p-3">
        <button onClick={prevMonth} className="p-2 text-white/80 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="text-white font-bold text-sm">
          {MONTHS[month]} {year}
        </p>
        <button onClick={nextMonth} className="p-2 text-white/80 hover:text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-[#005A20] border border-[#2E8B57]/40 rounded-2xl p-3">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center text-white/50 text-[10px] font-bold py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = fmtKey(d);
            const hasEvents = !!byDay[key];
            const isToday = sameDay(d, today);
            const isSelected = sameDay(d, selected);
            return (
              <button
                key={i}
                onClick={() => setSelected(d)}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold relative transition
                  ${isSelected ? "bg-[#2E8B57] text-white" : isToday ? "bg-[#007A2E] text-white border border-[#2E8B57]" : "text-white/80 hover:bg-[#007A2E]/50"}`}
              >
                {d.getDate()}
                {hasEvents && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#9CE5B5]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-white/70 text-xs font-bold mb-2 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        {selectedEvents.length === 0 ? (
          <div className="rounded-xl bg-[#005A20]/60 border border-[#2E8B57]/30 p-4 text-center">
            <p className="text-white/50 text-sm">Nenhum evento neste dia.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedEvents.map(ev => (
              <div key={ev.id} className="rounded-xl bg-[#005A20] border border-[#2E8B57]/40 p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm">{ev.nome}</p>
                  <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {ev.local}
                  </p>
                  <p className="text-white/60 text-xs">{ev.tipo} • {ev.data}</p>
                </div>
                <Link to="/check-in" className="shrink-0">
                  <Button size="sm" className="h-8 bg-[#2E8B57] hover:bg-[#35996a] text-xs font-bold px-3">
                    Check-in
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {eventos === null ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>
      ) : (
        <div>
          <p className="text-white/70 text-xs font-bold mb-2">PRÓXIMOS EVENTOS</p>
          {upcomingEvents.length === 0 ? (
            <p className="text-white/50 text-sm">Nenhum evento futuro cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.slice(0, 5).map(ev => (
                <button
                  key={ev.id}
                  onClick={() => { setSelected(ev._date); setCursor(new Date(ev._date.getFullYear(), ev._date.getMonth(), 1)); }}
                  className="w-full text-left rounded-xl bg-[#005A20] border border-[#2E8B57]/40 p-3 flex items-center gap-3"
                >
                  <div className="flex flex-col items-center justify-center bg-[#007A2E] rounded-lg w-12 h-12 shrink-0">
                    <span className="text-white text-[10px] font-bold uppercase">{MONTHS[ev._date.getMonth()].slice(0,3)}</span>
                    <span className="text-white text-lg font-bold leading-none">{ev._date.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{ev.nome}</p>
                    <p className="text-white/60 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ev.local}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
