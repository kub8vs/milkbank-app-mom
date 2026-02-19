import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Droplets } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";
import ImpactTracker from "@/components/ImpactTracker";
import BottleWidget from "@/components/BottleWidget";
import MilkEntry from "@/components/MilkEntry";
import BatchStatus from "@/components/BatchStatus";

const HomePage: React.FC = () => {
  const { language, theme, setTheme } = useApp();

  const hour = new Date().getHours();
  const greetingKey = hour >= 18 || hour < 6 ? "greeting_evening" : "greeting_morning";

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between pt-2 pb-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="font-display font-black text-2xl" style={{ color: "hsl(var(--foreground))" }}>
            {t(greetingKey, language)}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="pulse-dot" />
            <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
              MilkBank Connect
            </span>
          </div>
        </div>

        {/* Night mode quick toggle */}
        <motion.button
          onClick={() => setTheme(theme === "night" ? "day" : "night")}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          whileTap={{ scale: 0.9 }}
          style={{
            background: theme === "night" ? "hsl(36 90% 55%)" : "hsl(var(--muted))",
            color: theme === "night" ? "hsl(28 45% 10%)" : "hsl(var(--muted-foreground))",
          }}
          aria-label={t("night_mode", language)}
        >
          {theme === "night" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>
      </motion.div>

      {/* Impact Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ImpactTracker />
      </motion.div>

      {/* Bottle + Quick Entry */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <BottleWidget />
        <div className="flex flex-col gap-3">
          {/* Quick stats */}
          <div className="glass-card p-4 flex-1 flex flex-col justify-center">
            <Droplets size={20} style={{ color: "hsl(var(--sky-blue-deep))" }} className="mb-2" />
            <div className="font-display font-black text-xl" style={{ color: "hsl(var(--foreground))" }}>
              {new Date().toLocaleDateString("pl-PL", { weekday: "short" })}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              {new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long" })}
            </div>
          </div>
          <div className="glass-card p-4 flex flex-col justify-center text-center">
            <div className="font-display font-black text-2xl" style={{ color: "hsl(var(--primary))" }}>
              🏆
            </div>
            <div className="font-display font-bold text-xs mt-1" style={{ color: "hsl(var(--foreground))" }}>
              Dawczyni Miesiąca
            </div>
          </div>
        </div>
      </motion.div>

      {/* Milk Entry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <MilkEntry />
      </motion.div>

      {/* Batch Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <BatchStatus />
      </motion.div>
    </div>
  );
};

export default HomePage;
