import React from "react";
import { Home, BookOpen, Map, NotebookPen } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";
import { motion } from "framer-motion";

const tabs = [
  { id: "home", icon: Home, key: "nav_home" },
  { id: "diary", icon: NotebookPen, key: "nav_diary" },
  { id: "map", icon: Map, key: "nav_map" },
  { id: "knowledge", icon: BookOpen, key: "nav_knowledge" },
];

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[64px]"
              style={{
                background: isActive ? "hsl(var(--primary-soft))" : "transparent",
              }}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                />
              </div>
              <span
                className="text-xs font-display font-semibold"
                style={{
                  color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  fontSize: "0.68rem",
                }}
              >
                {t(tab.key, language)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
