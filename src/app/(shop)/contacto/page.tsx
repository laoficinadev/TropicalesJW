"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/lib/i18n";

export default function ContactoPage() {
  const { t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || "",
      subject: form.get("subject"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success(t("contact.success"));
    } catch {
      toast.error(t("contact.error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
            <CheckCircle className="h-10 w-10 text-brand-accent" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("contact.success")}
          </h1>
          <p className="mt-2 text-gray-500">
            {t("contact.success")}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary"
          >
            {t("contact.send")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t("contact.title")}</h1>
        <p className="mt-2 text-gray-500">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          {[
            {
              icon: Mail,
              title: "Email",
              content: "theoffice7075@gmail.com",
            },
            {
              icon: Phone,
              title: t("contact.phone"),
              content: "+53 56671258",
            },
            {
              icon: MapPin,
              title: t("contact.infoTitle"),
              content: t("contact.address"),
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.name")} *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.email")} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.phone")}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.message")} *
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.message")} *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
