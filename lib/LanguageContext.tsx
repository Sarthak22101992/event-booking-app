"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Lang, t } from "./translations";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: typeof t.en;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  tr: t.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang, tr: t[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
