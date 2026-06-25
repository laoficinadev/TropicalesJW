import es from "./es.json";
import en from "./en.json";

export type Locale = "es" | "en";
type Translations = typeof es;

const translations: Record<Locale, Translations> = { es, en };

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.es;
}

export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let value: unknown = obj;
  for (const key of keys) {
    if (value && typeof value === "object" && key in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof value === "string" ? value : path;
}

export function translate(locale: Locale, path: string, vars?: Record<string, string | number>): string {
  const tr = getTranslations(locale);
  let text = getNestedValue(tr as unknown as Record<string, unknown>, path);
  if (vars) {
    for (const [key, val] of Object.entries(vars)) {
      text = text.replace(`{{${key}}}`, String(val));
    }
  }
  return text;
}

// Re-export for convenience
export { LocaleProvider, useLocale } from "@/components/LocaleProvider";
