import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Droplets, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2 
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BottleWidget from "@/components/BottleWidget";

const DiaryPage: React.FC = () => {
  const { language } = useApp();
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // 1. Pobieranie danych z Twojego serwera
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://192.168.1.86:3000/api/moje-mleko/1');
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Błąd połączenia:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // --- PANCERNA LOGIKA CZASU - TYLKO TEKST, ZERO DATE OBJECTS ---
  
  const getRawDate = (dateStr: string) => {
    if (!dateStr) return "";
    // MySQL format: YYYY-MM-DD HH:mm:ss -> wycinamy tylko YYYY-MM-DD
    const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
    const [y, m, d] = datePart.split('-');
    return `${d}.${m}.${y}`;
  };

  const getRawTime = (dateStr: string) => {
    if (!dateStr) return "--:--";
    /**
     * TUTAJ JEST NAPRAWA:
     * Wycinamy godzinę bezpośrednio z tekstu, który przyszedł z bazy.
     * JavaScript NIE MOŻE jej przesunąć, bo nie używamy 'new Date()'.
     */
    try {
      const delimiter = dateStr.includes('T') ? 'T' : ' ';
      const timePart = dateStr.split(delimiter)[1]; // Pobiera "14:30:00"
      return timePart.substring(0, 5); // Zwraca "14:30"
    } catch (e) {
      return "00:00";
    }
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || 'home';
    const configs: Record<string, any> = {
      'zgloszone': { color: 'bg-blue-500', text: 'Zgłoszone', bg: 'bg-blue-50', textColor: 'text-blue-600' },
      'home': { color: 'bg-blue-500', text: 'Zgłoszone', bg: 'bg-blue-50', textColor: 'text-blue-600' },
      'odebrane': { color: 'bg-amber-500', text: 'Odebrane', bg: 'bg-amber-50', textColor: 'text-amber-600' },
      'accepted': { color: 'bg-amber-500', text: 'Odebrane', bg: 'bg-amber-50', textColor: 'text-amber-600' },
      'pasteryzacja': { color: 'bg-purple-500', text: 'Pasteryzacja', bg: 'bg-purple-50', textColor: 'text-purple-600' },
      'gotowe': { color: 'bg-green-500', text: 'Dostarczone', bg: 'bg-green-50', textColor: 'text-green-600' },
      'delivered': { color: 'bg-green-500', text: 'Dostarczone', bg: 'bg-green-50', textColor: 'text-green-600' }
    };
    return configs[s] || { color: 'bg-slate-400', text: s, bg: 'bg-slate-50', textColor: 'text-slate-600' };
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 pt-8 px-5 font-sans antialiased text-slate-900">
      <header className="mb-8 flex flex-col gap-1">
        <h1 className="font-black text-3xl tracking-tight uppercase italic text-slate-900">
          {t("diary_title", language)}
        </h1>
        <div className="h-1 w-12 bg-pink-500 rounded-full" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Twoja osobista historia</p>
      </header>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 opacity-20">
            <Droplets size={48} className="animate-bounce text-pink-500" />
            <p className="font-black text-[10px] uppercase mt-4">Synchronizacja z bazą...</p>
          </div>
        ) : donations.map((donation, idx) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => setSelectedItem(donation)}
            className="bg-white p-5 rounded-[30px] flex items-center justify-between shadow-sm border border-slate-50 active:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[22px] bg-pink-50 flex items-center justify-center text-pink-500 shadow-inner">
                <Droplets size={26} />
              </div>
              <div>
                <div className="font-black text-2xl text-slate-800 tracking-tighter leading-none mb-1">
                  {donation.objetosc_ml} <span className="text-sm opacity-30">ml</span>
                </div>
                <div className="text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1">
                  <Calendar size={10} /> {getRawDate(donation.data_odciagniecia)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className={`h-2 w-2 rounded-full ${getStatusConfig(donation.status).color}`} />
               <ChevronRight size={20} className="text-slate-200" />
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-[94%] w-[380px] rounded-[48px] p-0 overflow-hidden border-none bg-white shadow-2xl outline-none">
          {selectedItem && (() => {
            const statusCfg = getStatusConfig(selectedItem.status);
            return (
              <div className="flex flex-col">
                <div className="bg-slate-50 p-12 flex justify-center items-center relative">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-8 left-8 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                  >
                    <ArrowLeft size={22} />
                  </button>
                  <div className="scale-125 drop-shadow-2xl">
                    <BottleWidget customAmount={selectedItem.objetosc_ml} />
                  </div>
                </div>

                <div className="p-8 pt-6 space-y-6">
                  <div className="text-center">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">Raport donacji</span>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mt-3">Partia #{selectedItem.id}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-5 rounded-[34px] border border-slate-100 flex flex-col items-center">
                      <Calendar size={20} className="text-pink-400 mb-1.5" />
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Dzień</span>
                      <p className="font-black text-slate-800 text-[13px]">{getRawDate(selectedItem.data_odciagniecia)}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-[34px] border border-slate-100 flex flex-col items-center">
                      <Clock size={20} className="text-pink-400 mb-1.5" />
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Godzina</span>
                      {/* WYŚWIETLANIE NAPRAWIONEJ GODZINY - SUROWY TEKST */}
                      <p className="font-black text-slate-800 text-lg italic tracking-tighter">
                        {getRawTime(selectedItem.data_odciagniecia)}
                      </p>
                    </div>
                  </div>

                  <div className={`${statusCfg.bg} p-6 rounded-[34px] flex items-center justify-between border border-white shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${statusCfg.color} shadow-sm animate-pulse`} />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Aktualny etap</span>
                        <span className={`font-black text-sm uppercase tracking-tight ${statusCfg.textColor}`}>
                          {statusCfg.text}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 size={24} className={statusCfg.textColor} />
                  </div>

                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-5 bg-slate-900 text-white rounded-[34px] font-black text-lg active:scale-[0.96] transition-all shadow-xl shadow-slate-200 uppercase"
                  >
                    Zamknij widok
                  </button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiaryPage;