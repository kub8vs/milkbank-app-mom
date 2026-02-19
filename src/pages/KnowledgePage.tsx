import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X, ShieldCheck, Apple, Snowflake, HelpCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/i18n/translations";

const KNOWLEDGE_ARTICLES = [
  {
    id: 1,
    category: "hygiene",
    category_key: "knowledge_hygiene",
    icon: ShieldCheck,
    color: "hsl(141 65% 45%)",
    bg: "hsl(141 70% 92%)",
    title: "Higiena przy odciąganiu",
    summary: "Czystość to podstawa bezpieczeństwa mleka dawczyni.",
    content: `**Przygotowanie przed odciąganiem:**
- Umyj dokładnie ręce przez co najmniej 20 sekund mydłem antybakteryjnym
- Upewnij się, że wszystkie naczynia są wysterylizowane (gotowanie lub sterylizator parowy)
- Oczyść laktatora/pompę zgodnie z instrukcją producenta

**Pojemniki na mleko:**
- Używaj tylko pojemników przeznaczonych do kontaktu z żywnością dla niemowląt
- Pojemniki jednorazowe są zalecane dla banku mleka
- Opisz każdy pojemnik: data, godzina, ilość

**Higiena piersi:**
- Delikatnie oczyść piersi wodą, bez mydła (niszczy naturalną florę)
- Nie stosuj kremów bezpośrednio przed odciąganiem`,
  },
  {
    id: 2,
    category: "diet",
    category_key: "knowledge_diet",
    icon: Apple,
    color: "hsl(25 80% 50%)",
    bg: "hsl(25 90% 92%)",
    title: "Dieta dawczyni",
    summary: "Co jeść, czego unikać, aby mleko było jak najlepsze.",
    content: `**Produkty zalecane:**
- Tłuste ryby (łosoś, makrela) – bogate w DHA 2–3x/tydzień
- Warzywa zielone: szpinak, brokuły, jarmuż
- Orzechy i nasiona – zdrowe tłuszcze
- Nabiał pełnotłusty (jeśli brak alergii)
- Odpowiednie nawodnienie: min. 2–3L płynów dziennie

**Czego unikać:**
- Alkohol (abstynencja lub przerwa min. 2h przed odciąganiem)
- Kofeina – max 300mg/dobę (2–3 kawy)
- Ryby o wysokiej zawartości rtęci (miecznik, rekin, tuńczyk)
- Owoce cytrusowe mogą powodować kolkę u wrażliwych niemowląt

**Suplementacja:**
- Wit. D3 – 1500–2000 IU/dobę
- Omega-3 DHA – 200–500mg/dobę
- Jod – skonsultuj z lekarzem`,
  },
  {
    id: 3,
    category: "storage",
    category_key: "knowledge_storage",
    icon: Snowflake,
    color: "hsl(201 80% 45%)",
    bg: "hsl(201 94% 92%)",
    title: "Przechowywanie mleka",
    summary: "Jak prawidłowo przechowywać odciągnięte mleko.",
    content: `**Czas przechowywania:**
| Miejsce | Temperatura | Czas |
|---------|-------------|------|
| Temperatura pokojowa | do 25°C | 4–6 godzin |
| Lodówka | 2–4°C | do 4 dni |
| Zamrażarka jednodrzwiowa | -15°C | 3–6 miesięcy |
| Zamrażarka głęboka | -20°C | 6–12 miesięcy |

**Wskazówki:**
- Zamrażaj mleko jak najszybciej po odciągnięciu
- Nie zamrażaj ponownie rozmrożonego mleka
- Rozmrażaj w lodówce przez noc lub pod ciepłą wodą
- Nie podgrzewaj w kuchence mikrofalowej

**Dla banku mleka:**
- Mleko musi być zamrożone w ciągu 12h od odciągnięcia
- Każda partia musi być opisana datą i ilością
- Ważność: 6 miesięcy od daty odciągnięcia`,
  },
  {
    id: 4,
    category: "faq",
    category_key: "knowledge_faq",
    icon: HelpCircle,
    color: "hsl(280 60% 50%)",
    bg: "hsl(280 70% 93%)",
    title: "FAQ Zdrowotne",
    summary: "Najczęstsze pytania dotyczące kwalifikacji dawczyń.",
    content: `**Czy mogę oddawać mleko jeśli…**

🔴 **Przyjmuję leki?**
Wiele leków jest bezpiecznych, jednak każdy przypadek wymaga indywidualnej oceny lekarza banku mleka. Skontaktuj się z nami przed rejestracją.

🟡 **Miałam tatuaż/piercing?**
Kwalifikacja możliwa po upływie 6 miesięcy od zabiegu, pod warunkiem braku powikłań.

🟢 **Byłam szczepiona?**
Większość szczepień nie wyklucza z dawstwa. Szczepionki żywe wymagają 4-tygodniowej przerwy.

🔴 **Palę papierosy?**
Palenie czynne wyklucza z dawstwa mleka. Nikotynowa terapia zastępcza – skonsultuj z lekarzem.

🟡 **Piję kawę?**
Dozwolone do 300mg kofeiny/dobę (ok. 2–3 filiżanki). Kofeina przechodzi do mleka, ale w małych ilościach.

🟢 **Jestem wegetarianką?**
Tak, pod warunkiem odpowiedniej suplementacji (B12, D3, żelazo, wapń).`,
  },
];

const KnowledgePage: React.FC = () => {
  const { language } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openArticle, setOpenArticle] = useState<(typeof KNOWLEDGE_ARTICLES)[0] | null>(null);

  const categories = [
    { key: "knowledge_hygiene", value: "hygiene" },
    { key: "knowledge_diet", value: "diet" },
    { key: "knowledge_storage", value: "storage" },
    { key: "knowledge_faq", value: "faq" },
  ];

  const filtered = KNOWLEDGE_ARTICLES.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-container space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2 pb-1"
      >
        <h1 className="font-display font-black text-2xl" style={{ color: "hsl(var(--foreground))" }}>
          {t("knowledge_title", language)}
        </h1>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
        <input
          type="text"
          placeholder={t("knowledge_search", language)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl font-body text-sm focus:outline-none transition-all"
          style={{
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            border: "2px solid " + (search ? "hsl(var(--primary))" : "hsl(var(--border))"),
          }}
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory(null)}
          className="shrink-0 px-4 py-2 rounded-full font-display font-bold text-sm transition-all"
          style={{
            background: !activeCategory ? "hsl(var(--primary))" : "hsl(var(--muted))",
            color: !activeCategory ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
          }}
        >
          Wszystkie
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
            className="shrink-0 px-4 py-2 rounded-full font-display font-bold text-sm transition-all"
            style={{
              background: activeCategory === cat.value ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: activeCategory === cat.value ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
            }}
          >
            {t(cat.key, language)}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.map((article, i) => {
          const Icon = article.icon;
          return (
            <motion.button
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setOpenArticle(article)}
              className="w-full glass-card p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: article.bg }}
                >
                  <Icon size={22} style={{ color: article.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    {article.title}
                  </div>
                  <div className="text-xs mt-0.5 line-clamp-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {article.summary}
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {openArticle && (
          <>
            <motion.div
              className="fixed inset-0"
              style={{ background: "hsl(230 25% 18% / 0.5)", backdropFilter: "blur(6px)", zIndex: 60 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenArticle(null)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 space-y-4"
              style={{
                background: "hsl(var(--card))",
                zIndex: 61,
                maxHeight: "80dvh",
                overflowY: "auto",
                paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-10 h-1 rounded-full mx-auto -mt-2" style={{ background: "hsl(var(--border))" }} />

              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: openArticle.bg }}
                >
                  <openArticle.icon size={26} style={{ color: openArticle.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold mb-1" style={{ color: openArticle.color }}>
                    {t(openArticle.category_key, language)}
                  </div>
                  <h2 className="font-display font-black text-xl leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                    {openArticle.title}
                  </h2>
                </div>
                <button
                  onClick={() => setOpenArticle(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                className="text-sm leading-relaxed space-y-2 font-body"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {openArticle.content.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return <p key={i} className="font-display font-bold text-base mt-3">{line.replace(/\*\*/g, "")}</p>;
                  }
                  if (line.startsWith("- ")) {
                    return <p key={i} className="pl-3 border-l-2" style={{ borderColor: openArticle.color }}>• {line.slice(2)}</p>;
                  }
                  if (line.includes("🔴") || line.includes("🟡") || line.includes("🟢")) {
                    return <div key={i} className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>{line}</div>;
                  }
                  return line ? <p key={i}>{line}</p> : <div key={i} className="h-2" />;
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgePage;
