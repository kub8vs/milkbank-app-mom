import React from "react";
import { motion } from "framer-motion";
import { Heart, Droplets, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

const ImpactTracker: React.FC = () => {
  const { totalDonatedMl, getMealsProvided, language } = useApp();
  const meals = getMealsProvided();

  return (
    <div
      className="glass-card p-5 overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, hsl(322 87% 93%), hsl(201 94% 90%))",
        border: "none",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
        style={{ background: "hsl(var(--primary))" }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-15"
        style={{ background: "hsl(var(--sky-blue-deep))" }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--primary) / 0.15)" }}
          >
            <Heart size={16} fill="hsl(var(--primary))" style={{ color: "hsl(var(--primary))" }} />
          </div>
          <span className="font-display font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>
            {t("impact_title", language)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Meals */}
          <div
            className="rounded-2xl p-3 text-center"
            style={{ background: "hsl(0 0% 100% / 0.5)" }}
          >
            <motion.div
              className="font-display font-black text-3xl"
              style={{ color: "hsl(var(--primary))" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {meals.toLocaleString()}
            </motion.div>
            <div className="text-xs font-semibold mt-1" style={{ color: "hsl(var(--foreground) / 0.7)" }}>
              🍼 {t("impact_meals", language)}
            </div>
          </div>

          {/* ml donated */}
          <div
            className="rounded-2xl p-3 text-center"
            style={{ background: "hsl(0 0% 100% / 0.5)" }}
          >
            <div className="flex items-center justify-center gap-1">
              <motion.div
                className="font-display font-black text-3xl"
                style={{ color: "hsl(var(--sky-blue-deep))" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {(totalDonatedMl / 1000).toFixed(1)}
              </motion.div>
              <span className="font-display font-bold text-sm self-end pb-1" style={{ color: "hsl(var(--sky-blue-deep))" }}>
                L
              </span>
            </div>
            <div className="text-xs font-semibold mt-1" style={{ color: "hsl(var(--foreground) / 0.7)" }}>
              <Droplets size={10} className="inline mr-1" />
              {t("impact_donated", language)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5 font-semibold" style={{ color: "hsl(var(--foreground) / 0.6)" }}>
            <span>Cel: 5L</span>
            <span>{((totalDonatedMl / 5000) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.4)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--sky-blue-deep)))" }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalDonatedMl / 5000) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: [0.34, 1.2, 0.64, 1], delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
