import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Globe, Type, Contrast, Moon, Sun } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

const AccessibilityHub: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, theme, setTheme, highContrast, setHighContrast, fontSize, setFontSize } = useApp();

  const languages = [
    { code: "pl" as const, label: "PL", flag: "🇵🇱" },
    { code: "en" as const, label: "EN", flag: "🇬🇧" },
    { code: "ua" as const, label: "UA", flag: "🇺🇦" },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fab-accessibility"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 90 : 0 }}
        aria-label="Accessibility settings"
      >
        <Settings size={22} />
      </motion.button>

      {/* Side Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-70"
              style={{ backgroundColor: "hsl(230 25% 18% / 0.3)", backdropFilter: "blur(4px)", zIndex: 70 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-80 w-72 flex flex-col"
              style={{
                zIndex: 80,
                background: "hsl(var(--card))",
                borderLeft: "1px solid hsl(var(--border))",
                boxShadow: "-8px 0 40px hsl(220 30% 20% / 0.12)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                <div>
                  <h2 className="font-display font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>
                    {t("acc_title", language)}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Language */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={16} style={{ color: "hsl(var(--primary))" }} />
                    <span className="font-display font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                      {t("acc_language", language)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className="flex-1 py-3 rounded-2xl font-display font-bold text-sm transition-all duration-200"
                        style={{
                          background: language === lang.code ? "hsl(var(--primary))" : "hsl(var(--muted))",
                          color: language === lang.code ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                          boxShadow: language === lang.code ? "0 4px 12px hsl(var(--primary) / 0.3)" : "none",
                        }}
                      >
                        <span className="text-lg block">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Font Size */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Type size={16} style={{ color: "hsl(var(--primary))" }} />
                    <span className="font-display font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                      {t("acc_font_size", language)} — {fontSize}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={80}
                      max={140}
                      step={10}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: "hsl(var(--primary))" }}
                    />
                    <div className="flex justify-between text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <span>A</span>
                      <span className="text-base">A</span>
                      <span className="text-xl">A</span>
                    </div>
                  </div>
                </section>

                {/* Night Mode */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    {theme === "night" ? <Moon size={16} style={{ color: "hsl(var(--primary))" }} /> : <Sun size={16} style={{ color: "hsl(var(--primary))" }} />}
                    <span className="font-display font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                      {t("acc_night", language)}
                    </span>
                  </div>
                  <button
                    onClick={() => setTheme(theme === "night" ? "day" : "night")}
                    className="w-full py-3 rounded-2xl font-display font-bold text-sm transition-all duration-200"
                    style={{
                      background: theme === "night" ? "hsl(36 90% 55%)" : "hsl(var(--muted))",
                      color: theme === "night" ? "hsl(28 45% 10%)" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {theme === "night" ? "🌙 " + t("night_mode", language) : "☀️ " + t("day_mode", language)}
                  </button>
                </section>

                {/* High Contrast */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Contrast size={16} style={{ color: "hsl(var(--primary))" }} />
                    <span className="font-display font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                      {t("acc_contrast", language)}
                    </span>
                  </div>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className="w-full py-3 rounded-2xl font-display font-bold text-sm transition-all duration-200"
                    style={{
                      background: highContrast ? "hsl(60 100% 50%)" : "hsl(var(--muted))",
                      color: highContrast ? "hsl(60 100% 5%)" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {highContrast ? "⚡ Włączony" : "Wyłączony"}
                  </button>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityHub;
