import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

interface BottleWidgetProps {
  maxCapacity?: number;
}

const BottleWidget: React.FC<BottleWidgetProps> = ({ maxCapacity = 600 }) => {
  const { totalStoredMl, language } = useApp();
  const fillPercent = Math.min((totalStoredMl / maxCapacity) * 100, 100);

  const getColor = () => {
    if (fillPercent > 60) return "hsl(201 80% 55%)";
    if (fillPercent > 30) return "hsl(201 75% 68%)";
    return "hsl(201 70% 80%)";
  };

  return (
    <div className="glass-card p-5 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Droplets size={18} style={{ color: "hsl(var(--sky-blue-deep))" }} />
        <span className="font-display font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
          {t("bottle_stored", language)}
        </span>
      </div>

      {/* Bottle SVG */}
      <div className="relative w-20 h-32">
        <svg viewBox="0 0 80 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Bottle neck */}
          <rect x="28" y="5" width="24" height="20" rx="8" fill="hsl(var(--border))" />
          {/* Bottle body outline */}
          <path
            d="M 18 28 Q 10 40 10 60 L 10 105 Q 10 122 40 122 Q 70 122 70 105 L 70 60 Q 70 40 62 28 Z"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          {/* Clip for fill */}
          <defs>
            <clipPath id="bottle-clip">
              <path d="M 18 28 Q 10 40 10 60 L 10 105 Q 10 122 40 122 Q 70 122 70 105 L 70 60 Q 70 40 62 28 Z" />
            </clipPath>
          </defs>
          {/* Milk fill - animated */}
          <motion.rect
            x="10"
            y={122 - (94 * fillPercent) / 100}
            width="60"
            height={(94 * fillPercent) / 100 + 10}
            fill={getColor()}
            clipPath="url(#bottle-clip)"
            initial={{ y: 122, height: 0 }}
            animate={{
              y: 122 - (94 * fillPercent) / 100,
              height: (94 * fillPercent) / 100 + 10,
            }}
            transition={{ duration: 1.2, ease: [0.34, 1.2, 0.64, 1] }}
          />
          {/* Wave overlay */}
          {totalStoredMl > 0 && fillPercent > 0 && (
            <motion.ellipse
              cx="40"
              cy={122 - (94 * fillPercent) / 100}
              rx="30"
              ry={4}
              fill={getColor()}
              opacity="0.6"
              animate={{ ry: [4, 2, 4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {/* Cap */}
          <rect x="26" y="2" width="28" height="10" rx="5" fill="hsl(var(--primary))" />
          {/* Measurement lines */}
          <line x1="65" y1="75" x2="70" y2="75" stroke="hsl(var(--border))" strokeWidth="1.5" />
          <line x1="65" y1="95" x2="70" y2="95" stroke="hsl(var(--border))" strokeWidth="1.5" />
          <line x1="65" y1="55" x2="70" y2="55" stroke="hsl(var(--border))" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="text-center">
        {totalStoredMl > 0 ? (
          <>
            <motion.div
              className="font-display font-black text-2xl"
              style={{ color: "hsl(var(--sky-blue-deep))" }}
              key={totalStoredMl}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {totalStoredMl} ml
            </motion.div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              {Math.round(fillPercent)}% pojemności
            </div>
          </>
        ) : (
          <div className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("bottle_empty", language)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottleWidget;
