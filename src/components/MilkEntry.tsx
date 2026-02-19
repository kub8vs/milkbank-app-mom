import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

const QUICK_AMOUNTS = [50, 100, 150, 200];

const MilkEntry: React.FC = () => {
  const { language, addMilkEntry } = useApp();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const amount = selected ?? (custom ? parseInt(custom) : 0);
    if (!amount || amount <= 0) return;
    addMilkEntry(amount);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelected(null);
      setCustom("");
    }, 2000);
  };

  const getAmount = () => selected ?? (custom ? parseInt(custom) : 0);

  return (
    <div className="glass-card p-5 space-y-4">
      <div>
        <h3 className="font-display font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
          {t("quick_add", language)}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          {t("quick_add_subtitle", language)}
        </p>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <motion.button
            key={amount}
            className={`ml-btn ${selected === amount ? "selected" : ""}`}
            onClick={() => { setSelected(selected === amount ? null : amount); setCustom(""); }}
            whileTap={{ scale: 0.93 }}
            style={{
              background: selected === amount ? "hsl(var(--primary-soft))" : "hsl(0 0% 100% / 0.7)",
              borderColor: selected === amount ? "hsl(var(--primary))" : "transparent",
              color: selected === amount ? "hsl(var(--pink-deep))" : "hsl(var(--foreground))",
            }}
          >
            <span className="font-display font-extrabold text-lg">{amount}</span>
            <span className="text-xs font-medium opacity-70">ml</span>
          </motion.button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="relative">
        <input
          type="number"
          min="1"
          max="999"
          placeholder={t("add_custom", language) + "..."}
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
          className="w-full rounded-2xl px-4 py-3 text-base font-display font-semibold focus:outline-none transition-all"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--foreground))",
            border: custom ? "2px solid hsl(var(--primary))" : "2px solid transparent",
          }}
        />
        {custom && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "hsl(var(--muted-foreground))" }}>
            ml
          </span>
        )}
      </div>

      {/* Add Button */}
      <AnimatePresence mode="wait">
        {added ? (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 font-display font-bold text-base"
            style={{ background: "hsl(141 70% 50%)", color: "white" }}
          >
            <Check size={20} />
            Dodano! 🎉
          </motion.div>
        ) : (
          <motion.button
            key="add"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={handleAdd}
            disabled={!getAmount()}
            whileTap={{ scale: 0.96 }}
            className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 font-display font-bold text-base transition-all"
            style={{
              background: getAmount() ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: getAmount() ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              boxShadow: getAmount() ? "0 4px 20px hsl(var(--primary) / 0.35)" : "none",
              cursor: getAmount() ? "pointer" : "not-allowed",
            }}
          >
            <Plus size={20} />
            {t("add_btn", language)}
            {getAmount() > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "hsl(0 0% 100% / 0.25)" }}>
                {getAmount()} ml
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MilkEntry;
