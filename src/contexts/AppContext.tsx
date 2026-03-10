import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "pl" | "en" | "ua";
export type Theme = "day" | "night";

interface MilkBatch {
  id: string;
  amount: number; // ml
  expressedAt: Date;
  expiresAt: Date;
  status: "home" | "accepted" | "pasteurization" | "delivered";
}

interface AppState {
  language: Language;
  theme: Theme;
  highContrast: boolean;
  fontSize: number; // percentage, 100 = default
  totalStoredMl: number;
  totalDonatedMl: number;
  batches: MilkBatch[];
  activeTab: string;
}

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setHighContrast: (value: boolean) => void;
  setFontSize: (size: number) => void;
  setActiveTab: (tab: string) => void;
  addMilkEntry: (amount: number) => void;
  getMealsProvided: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STAN POCZĄTKOWY - CAŁKOWICIE WYZEROWANY DLA NOWEJ MATKI
  const [state, setState] = useState<AppState>({
    language: "pl",
    theme: "day",
    highContrast: false,
    fontSize: 100,
    totalStoredMl: 0, // Zaczynamy od 0 ml
    totalDonatedMl: 0, // Zaczynamy od 0 ml
    batches: [],       // Brak historii na starcie
    activeTab: "home",
  });

  // Obsługa efektów wizualnych (tryb nocny, kontrast, czcionka)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("night-mode", state.theme === "night");
    root.classList.toggle("high-contrast", state.highContrast);
    root.style.fontSize = `${state.fontSize}%`;
  }, [state.theme, state.highContrast, state.fontSize]);

  // Funkcje aktualizujące ustawienia
  const setLanguage = useCallback((language: Language) => setState(s => ({ ...s, language })), []);
  const setTheme = useCallback((theme: Theme) => setState(s => ({ ...s, theme })), []);
  const setHighContrast = useCallback((highContrast: boolean) => setState(s => ({ ...s, highContrast })), []);
  const setFontSize = useCallback((fontSize: number) => setState(s => ({ ...s, fontSize })), []);
  const setActiveTab = useCallback((activeTab: string) => setState(s => ({ ...s, activeTab })), []);

  // Funkcja dodawania wpisu (lokalnie w aplikacji)
  const addMilkEntry = useCallback((amount: number) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 6); // Mleko ważne 6 miesięcy w zamrażarce

    const newBatch: MilkBatch = {
      id: Date.now().toString(),
      amount,
      expressedAt: now,
      expiresAt: expires,
      status: "home",
    };

    setState(s => ({
      ...s,
      batches: [newBatch, ...s.batches],
      totalStoredMl: s.totalStoredMl + amount,
    }));
  }, []);

  // Obliczanie "uratowanych posiłków" na podstawie realnych danych matki
  const getMealsProvided = useCallback(() => {
    // Przyjmujemy statystycznie, że każde 25ml to porcja dla noworodka (4 porcje na 100ml)
    return Math.floor(state.totalStoredMl / 100) * 4;
  }, [state.totalStoredMl]);

  return (
    <AppContext.Provider 
      value={{ 
        ...state, 
        setLanguage, 
        setTheme, 
        setHighContrast, 
        setFontSize, 
        setActiveTab, 
        addMilkEntry, 
        getMealsProvided 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export type { MilkBatch };