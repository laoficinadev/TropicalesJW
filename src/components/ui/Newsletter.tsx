"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function Newsletter() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <section className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-dark p-8 md:p-12">
      <div className="mx-auto max-w-xl text-center">
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white"
        >
          {t("newsletter.title")}
        </motion.h3>
        <p className="mt-2 text-sm text-gray-300">
          {t("newsletter.subtitle")}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.placeholder")}
            required
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 outline-none backdrop-blur-sm transition focus:border-white/40 focus:bg-white/20"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-white/90 disabled:opacity-70"
          >
            {status === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {status === "success" ? t("newsletter.success") : t("newsletter.button")}
          </button>
        </form>
        {status === "error" && (
          <p className="mt-2 text-xs text-red-300">{t("newsletter.error")}</p>
        )}
      </div>
    </section>
  );
}
