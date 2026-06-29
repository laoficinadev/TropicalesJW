"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex items-center gap-1.5 text-sm text-gray-400"
    >
      <Link href="/" className="flex items-center gap-1 transition hover:text-brand-accent">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link href={item.href} className="transition hover:text-brand-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}
