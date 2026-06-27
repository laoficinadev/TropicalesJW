"use client";

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("react-hot-toast").then((m) => m.Toaster), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "8px",
          },
        }}
      />
    </SessionProvider>
  );
}
