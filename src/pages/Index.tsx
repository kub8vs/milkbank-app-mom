import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import BottomNav from "@/components/BottomNav";
import AccessibilityHub from "@/components/AccessibilityHub";
import HomePage from "@/pages/HomePage";
import DiaryPage from "@/pages/DiaryPage";
import MapPage from "@/pages/MapPage";
import KnowledgePage from "@/pages/KnowledgePage";
import MedicalSurvey from "@/components/MedicalSurvey"; // Importujemy nową ankietę

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

  // Stan sprawdzający, czy pokazać ankietę (pobiera informację z pamięci przeglądarki)
  const [showSurvey, setShowSurvey] = useState(() => {
    return localStorage.getItem('survey_done') !== 'true';
  });

  const handleSurveyComplete = () => {
    localStorage.setItem('survey_done', 'true');
    setShowSurvey(false);
  };

  return (
    <div className="relative min-h-dvh bg-[#FAFAFA]">
      {/* Warstwa ankiety medycznej - blokuje dostęp do apki dopóki nie zostanie wypełniona */}
      <AnimatePresence>
        {showSurvey && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md p-4 flex items-center justify-center"
          >
            <MedicalSurvey onComplete={handleSurveyComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Główna treść aplikacji */}
      <div className={showSurvey ? "blur-sm pointer-events-none" : ""}>
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
    </div>
  );
};

export default Index;