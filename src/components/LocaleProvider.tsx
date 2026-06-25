"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { translate, type Locale } from "@/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "es",
  setLocale: () => {},
  t: (path: string) => path,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "es") {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("locale", newLocale);
      document.documentElement.lang = newLocale === "en" ? "en" : "es";
    } catch {}
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>): string => {
      return translate(locale, path, vars);
    },
    [locale]
  );

  if (!mounted) {
    const fallbackT = (path: string, vars?: Record<string, string | number>): string => {
      return translate("es", path, vars);
    };
    return (
      <LocaleContext.Provider value={{ locale: "es", setLocale, t: fallbackT }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
