import { cookies } from "next/headers";
import { translate, type Locale } from "./index";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  if (cookieLocale === "en" || cookieLocale === "es") return cookieLocale;
  return "es";
}

export async function t(path: string, vars?: Record<string, string | number>): Promise<string> {
  const locale = await getServerLocale();
  return translate(locale, path, vars);
}