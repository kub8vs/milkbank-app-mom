import React from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

interface BottleWidgetProps {
  maxCapacity?: number;
  customAmount?: number; // Pozwala wyświetlić konkretną ilość (np. w modalu szczegółów)
}

const BottleWidget: React.FC<BottleWidgetProps> = ({ maxCapacity = 250, customAmount }) => {
  const { totalStoredMl, language } = useApp();

  // Jeśli podano customAmount (widok szczegółów), używamy go. 
  // W przeciwnym razie używamy całkowitej ilości z kontekstu (widok główny).
  const displayAmount = customAmount !== undefined ? customAmount : totalStoredMl;
  
  // Obliczamy procent wypełnienia względem pojemności (maxCapacity)
  const fillPercent = Math.min((displayAmount / maxCapacity) * 100, 100);

  // Kolory mleka (Biel i bardzo jasny różowy dla cieni)
  const milkColor = "#FFFFFF"; 
  const milkShadow = "#FFF0F5"; 

  return (
    <div className={`flex flex-col items-center gap-3 ${!customAmount ? 'glass-card p-5' : ''}`}>
      {/* Nagłówek - pokazujemy tylko na ekranie głównym */}
      {!customAmount && (
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-pink-400" />
          <span className="font-display font-semibold text-sm text-slate-700">
            {t("bottle_stored", language)}
          </span>
        </div>
      )}

      {/* Kontener butelki */}
      <div className="relative w-24 h-40">
        <svg viewBox="0 0 80 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Szyjka butelki */}
          <rect x="28" y="15" width="24" height="15" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Kształt butelki (tło/szkło) */}
          <path
            d="M 18 28 Q 10 40 10 60 L 10 110 Q 10 125 40 125 Q 70 125 70 110 L 70 60 Q 70 40 62 28 Z"
            fill="rgba(241, 245, 249, 0.4)"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Maska (ClipPath) - aby mleko nie "wylewało" się poza obrys butelki */}
          <defs>
            <clipPath id="bottle-clip-path">
              <path d="M 18 28 Q 10 40 10 60 L 10 110 Q 10 125 40 125 Q 70 125 70 110 L 70 60 Q 70 40 62 28 Z" />
            </clipPath>
          </defs>

          {/* Wypełnienie mlekiem (Animowany prostokąt) */}
          <motion.rect
            x="0"
            y={125 - (97 * fillPercent) / 100}
            width="80"
            height="130"
            fill={milkColor}
            clipPath="url(#bottle-clip-path)"
            initial={{ height: 0, y: 125 }}
            animate={{
              y: 125 - (97 * fillPercent) / 100,
              height: 130,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Efekt fali na górze mleka */}
          {displayAmount > 0 && (
            <motion.ellipse
              cx="40"
              cy={125 - (97 * fillPercent) / 100}
              rx="30"
              ry="4"
              fill={milkShadow}
              clipPath="url(#bottle-clip-path)"
              animate={{
                ry: [3, 5, 3],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Zakrętka (Różowa) */}
          <rect x="24" y="5" width="32" height="14" rx="6" fill="#ec4899" />

          {/* Linie miarki na butelce */}
          <g stroke="#cbd5e1" strokeWidth="1" opacity="0.6">
            <line x1="55" y1="50" x2="65" y2="50" />
            <line x1="55" y1="75" x2="65" y2="75" />
            <line x1="55" y1="100" x2="65" y2="100" />
          </g>
        </svg>

        {/* Licznik ML wewnątrz butelki */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
            <motion.span 
              key={displayAmount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-black text-xl text-slate-700 drop-shadow-sm"
            >
              {displayAmount}
            </motion.span>
        </div>
      </div>

      {/* Podpis pod butelką */}
      <div className="text-center">
        {displayAmount > 0 ? (
          <>
            <div className="font-display font-black text-2xl text-pink-500">
              {displayAmount} ml
            </div>
            {!customAmount && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                {Math.round(fillPercent)}% Pojemności
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-slate-400 italic">
            {t("bottle_empty", language)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottleWidget;