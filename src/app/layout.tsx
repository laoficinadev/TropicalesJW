import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LocaleProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "TropicalesJW - Productos Tropicales",
  description:
    "Tienda online de TropicalesJW. Los mejores productos tropicales frescos y de calidad.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("locale");if(l==="en")document.documentElement.lang="en"}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
