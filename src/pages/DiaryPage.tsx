import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";
import MilkEntry from "@/components/MilkEntry";
import BatchStatus from "@/components/BatchStatus";

const DiaryPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="page-container space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2 pb-1"
      >
        <h1 className="font-display font-black text-2xl" style={{ color: "hsl(var(--foreground))" }}>
          {t("diary_title", language)}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          {t("diary_subtitle", language)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MilkEntry />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BatchStatus />
      </motion.div>
    </div>
  );
};

export default DiaryPage;
