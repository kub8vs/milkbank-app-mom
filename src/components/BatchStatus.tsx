import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { useApp, type MilkBatch } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

const STATUS_CONFIG: Record<MilkBatch["status"], { label_key: string; color: string; bg: string; dot: string }> = {
  home: { label_key: "batch_home", color: "hsl(36 80% 45%)", bg: "hsl(36 90% 92%)", dot: "hsl(36 90% 55%)" },
  accepted: { label_key: "batch_accepted", color: "hsl(201 70% 40%)", bg: "hsl(201 80% 92%)", dot: "hsl(201 80% 55%)" },
  pasteurization: { label_key: "batch_pasteur", color: "hsl(280 60% 45%)", bg: "hsl(280 70% 93%)", dot: "hsl(280 60% 60%)" },
  delivered: { label_key: "batch_delivered", color: "hsl(141 60% 35%)", bg: "hsl(141 70% 92%)", dot: "hsl(141 70% 50%)" },
};

interface BatchCardProps {
  batch: MilkBatch;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const { language } = useApp();
  const config = STATUS_CONFIG[batch.status];
  const now = new Date();
  const daysLeft = Math.ceil((batch.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-4 flex items-center gap-3"
    >
      {/* Amount */}
      <div
        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0"
        style={{ background: "hsl(var(--primary-soft))" }}
      >
        <span className="font-display font-black text-base" style={{ color: "hsl(var(--pink-deep))" }}>
          {batch.amount}
        </span>
        <span className="text-xs font-semibold" style={{ color: "hsl(var(--pink-deep) / 0.7)" }}>ml</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: config.dot }} />
          <span className="text-xs font-display font-bold" style={{ color: config.color }}>
            {t(config.label_key, language)}
          </span>
        </div>
        <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          {batch.expressedAt.toLocaleDateString("pl-PL")}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Clock size={10} style={{ color: isExpired ? "hsl(0 72% 60%)" : "hsl(var(--muted-foreground))" }} />
          <span
            className="text-xs font-semibold"
            style={{ color: isExpired ? "hsl(0 72% 60%)" : "hsl(var(--muted-foreground))" }}
          >
            {isExpired
              ? t("expired", language)
              : `${t("expires_in", language)} ${daysLeft} ${t("days", language)}`}
          </span>
        </div>
      </div>

      {/* Status chip */}
      <div
        className="px-2.5 py-1.5 rounded-xl shrink-0"
        style={{ background: config.bg }}
      >
        <span className="text-xs font-display font-bold" style={{ color: config.color }}>
          {batch.status === "delivered" ? "✓" : "→"}
        </span>
      </div>
    </motion.div>
  );
};

const BatchStatus: React.FC = () => {
  const { batches, language } = useApp();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
          {t("status_title", language)}
        </h3>
        <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>
          {batches.length} partii
        </span>
      </div>

      {/* Status pipeline */}
      <div className="glass-card p-3 mb-3">
        <div className="flex items-center gap-1">
          {(["home", "accepted", "pasteurization", "delivered"] as MilkBatch["status"][]).map((status, i) => {
            const config = STATUS_CONFIG[status];
            return (
              <React.Fragment key={status}>
                <div className="flex-1 text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ background: config.dot }}
                  />
                  <div className="text-xs font-semibold leading-tight" style={{ color: config.color, fontSize: "0.6rem" }}>
                    {t(config.label_key, language).split(" ")[0]}
                  </div>
                </div>
                {i < 3 && (
                  <ChevronRight size={12} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {batches.length === 0 ? (
          <div className="text-center py-6 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("no_entries", language)}
          </div>
        ) : (
          batches.slice(0, 4).map((batch) => <BatchCard key={batch.id} batch={batch} />)
        )}
      </div>
    </div>
  );
};

export default BatchStatus;
