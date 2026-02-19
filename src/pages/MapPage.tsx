import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Clock, Info, MapPin, Heart } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

// Static milk bank data (Poland)
const MILK_BANKS = [
  {
    id: 1,
    name: "Bank Mleka Kobiecego – Szpital Wolski",
    city: "Warszawa",
    lat: 52.2297,
    lng: 21.0122,
    hours: "Pon–Pt: 8:00–15:00",
    phone: "+48 22 388 03 33",
    instructions: "Mleko należy przynieść w oryginalnych pojemnikach z etykietą. Wymagane wcześniejsze badania dawczyni.",
    address: "ul. Kasprzaka 17, 01-211 Warszawa",
  },
  {
    id: 2,
    name: "Bank Mleka – Szpital Bielański",
    city: "Warszawa",
    lat: 52.2944,
    lng: 20.9438,
    hours: "Pon–Pt: 7:00–14:00",
    phone: "+48 22 864 11 11",
    instructions: "Odbiór mleka wyłącznie po rejestracji. Pojemniki sterylne dostarczane przez bank.",
    address: "ul. Cegłowska 80, 01-809 Warszawa",
  },
  {
    id: 3,
    name: "Bank Mleka – ICZMP Łódź",
    city: "Łódź",
    lat: 51.7592,
    lng: 19.4560,
    hours: "Całą dobę (oddział neonatologii)",
    phone: "+48 42 271 17 00",
    instructions: "Przyjmujemy mleko przez całą dobę. Prosimy o kontakt telefoniczny przed pierwszą wizytą.",
    address: "ul. Rzgowska 281/289, 93-338 Łódź",
  },
  {
    id: 4,
    name: "Bank Mleka – Szpital Ginekologiczny Poznań",
    city: "Poznań",
    lat: 52.4064,
    lng: 16.9252,
    hours: "Pon–Pt: 8:00–16:00",
    phone: "+48 61 659 03 00",
    instructions: "Wymagane zaświadczenie lekarskie. Mleko przyjmujemy wyłącznie od zarejestrowanych dawczyń.",
    address: "ul. Polna 33, 60-535 Poznań",
  },
  {
    id: 5,
    name: "Bank Mleka – Szpital Dziecięcy Kraków",
    city: "Kraków",
    lat: 50.0647,
    lng: 19.9450,
    hours: "Pon–Sob: 9:00–13:00",
    phone: "+48 12 658 20 11",
    instructions: "Pojemniki dostarczone przez bank. Oddanie mleka na oddziale neonatologii, piętro 2.",
    address: "ul. Wielicka 265, 30-663 Kraków",
  },
];

// Simple map representation (without actual leaflet to avoid SSR issues)
const MapPage: React.FC = () => {
  const { language } = useApp();
  const [selected, setSelected] = useState<(typeof MILK_BANKS)[0] | null>(null);

  return (
    <div className="page-container space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2 pb-1"
      >
        <h1 className="font-display font-black text-2xl" style={{ color: "hsl(var(--foreground))" }}>
          {t("map_title", language)}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          {t("map_subtitle", language)}
        </p>
      </motion.div>

      {/* Map Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden"
        style={{ height: 240, position: "relative" }}
      >
        {/* Stylized map background */}
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{
            background: "linear-gradient(135deg, hsl(201 60% 90%), hsl(201 40% 82%))",
          }}
        >
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
            <line x1="0" y1="120" x2="400" y2="120" stroke="white" strokeWidth="3" opacity="0.5" />
            <line x1="200" y1="0" x2="200" y2="240" stroke="white" strokeWidth="3" opacity="0.5" />
            <line x1="0" y1="60" x2="400" y2="180" stroke="white" strokeWidth="2" opacity="0.3" />
            <line x1="100" y1="0" x2="300" y2="240" stroke="white" strokeWidth="2" opacity="0.3" />
            {/* City blocks */}
            {[40, 80, 120, 160, 200, 240, 280, 320].map((x) =>
              [30, 70, 110, 150, 190].map((y) => (
                <rect key={`${x}-${y}`} x={x + 2} y={y + 2} width="36" height="26" rx="4" fill="white" opacity="0.2" />
              ))
            )}
          </svg>

          {/* Bank Markers */}
          {MILK_BANKS.map((bank, i) => {
            const positions = [
              { x: "50%", y: "48%" },
              { x: "35%", y: "25%" },
              { x: "65%", y: "72%" },
              { x: "20%", y: "60%" },
              { x: "78%", y: "35%" },
            ];
            const pos = positions[i] || { x: "50%", y: "50%" };

            return (
              <motion.button
                key={bank.id}
                onClick={() => setSelected(bank)}
                className="absolute"
                style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
                whileTap={{ scale: 0.9 }}
                animate={selected?.id === bank.id ? { scale: 1.2 } : { scale: 1 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "hsl(var(--primary) / 0.3)" }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative"
                    style={{
                      background: selected?.id === bank.id ? "hsl(var(--primary))" : "white",
                      border: "3px solid hsl(var(--primary))",
                    }}
                  >
                    <Heart
                      size={16}
                      fill={selected?.id === bank.id ? "white" : "hsl(var(--primary))"}
                      style={{ color: selected?.id === bank.id ? "white" : "hsl(var(--primary))" }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}

          <div
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-display font-bold"
            style={{ background: "hsl(0 0% 100% / 0.8)", color: "hsl(var(--foreground))" }}
          >
            {MILK_BANKS.length} banków w Polsce
          </div>
        </div>
      </motion.div>

      {/* Bank List */}
      <div className="space-y-2">
        {MILK_BANKS.map((bank, i) => (
          <motion.button
            key={bank.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => setSelected(bank)}
            className="w-full glass-card p-4 text-left transition-all duration-200"
            style={{
              border: selected?.id === bank.id ? "2px solid hsl(var(--primary))" : "2px solid transparent",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "hsl(var(--primary-soft))" }}
              >
                <MapPin size={18} style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                  {bank.name}
                </div>
                <div className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  📍 {bank.address}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <Clock size={10} />
                  {bank.hours}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0"
              style={{ background: "hsl(230 25% 18% / 0.4)", backdropFilter: "blur(4px)", zIndex: 60 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 space-y-4"
              style={{
                background: "hsl(var(--card))",
                zIndex: 61,
                maxHeight: "70dvh",
                overflowY: "auto",
                paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto -mt-2" style={{ background: "hsl(var(--border))" }} />

              <div className="flex items-start justify-between">
                <h2 className="font-display font-black text-lg leading-tight flex-1 pr-3" style={{ color: "hsl(var(--foreground))" }}>
                  {selected.name}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "hsl(var(--muted))" }}>
                  <Clock size={18} style={{ color: "hsl(var(--primary))" }} />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {t("bank_hours", language)}
                    </div>
                    <div className="font-display font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                      {selected.hours}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "hsl(var(--muted))" }}>
                  <Phone size={18} style={{ color: "hsl(var(--primary))" }} />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {t("bank_phone", language)}
                    </div>
                    <a
                      href={`tel:${selected.phone}`}
                      className="font-display font-bold text-sm"
                      style={{ color: "hsl(var(--sky-blue-deep))" }}
                    >
                      {selected.phone}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-2xl" style={{ background: "hsl(var(--primary-soft))" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={16} style={{ color: "hsl(var(--primary))" }} />
                    <div className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>
                      {t("bank_instructions", language)}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
                    {selected.instructions}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPage;
