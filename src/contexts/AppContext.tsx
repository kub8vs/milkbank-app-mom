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

const SAMPLE_BATCHES: MilkBatch[] = [
  {
    id: "1",
    amount: 150,
    expressedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 178 * 24 * 60 * 60 * 1000),
    status: "home",
  },
  {
    id: "2",
    amount: 200,
    expressedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 175 * 24 * 60 * 60 * 1000),
    status: "home",
  },
  {
    id: "3",
    amount: 300,
    expressedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "accepted",
  },
  {
    id: "4",
    amount: 450,
    expressedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "delivered",
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    language: "pl",
    theme: "day",
    highContrast: false,
    fontSize: 100,
    totalStoredMl: 350,
    totalDonatedMl: 2400,
    batches: SAMPLE_BATCHES,
    activeTab: "home",
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("night-mode", state.theme === "night");
    root.classList.toggle("high-contrast", state.highContrast);
    root.style.fontSize = `${state.fontSize}%`;
  }, [state.theme, state.highContrast, state.fontSize]);

  const setLanguage = useCallback((language: Language) => setState(s => ({ ...s, language })), []);
  const setTheme = useCallback((theme: Theme) => setState(s => ({ ...s, theme })), []);
  const setHighContrast = useCallback((highContrast: boolean) => setState(s => ({ ...s, highContrast })), []);
  const setFontSize = useCallback((fontSize: number) => setState(s => ({ ...s, fontSize })), []);
  const setActiveTab = useCallback((activeTab: string) => setState(s => ({ ...s, activeTab })), []);

  const addMilkEntry = useCallback((amount: number) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 6);

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

  const getMealsProvided = useCallback(() => {
    return Math.floor(state.totalDonatedMl / 100) * 4;
  }, [state.totalDonatedMl]);

  return (
    <AppContext.Provider value={{ ...state, setLanguage, setTheme, setHighContrast, setFontSize, setActiveTab, addMilkEntry, getMealsProvided }}>
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
