import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import BottomNav from "@/components/BottomNav";
import AccessibilityHub from "@/components/AccessibilityHub";
import HomePage from "@/pages/HomePage";
import DiaryPage from "@/pages/DiaryPage";
import MapPage from "@/pages/MapPage";
import KnowledgePage from "@/pages/KnowledgePage";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const PAGES: Record<string, React.ComponentType> = {
  home: HomePage,
  diary: DiaryPage,
  map: MapPage,
  knowledge: KnowledgePage,
};

const Index: React.FC = () => {
  const { activeTab } = useApp();
  const ActivePage = PAGES[activeTab] ?? HomePage;

  return (
    <div className="relative min-h-dvh">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <ActivePage />
        </motion.div>
      </AnimatePresence>

      <BottomNav />
      <AccessibilityHub />
    </div>
  );
};

export default Index;
