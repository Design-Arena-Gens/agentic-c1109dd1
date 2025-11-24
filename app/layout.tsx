"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

function useReduceMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const prefersReducedMotion = useReduceMotionPreference();

  return (
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 antialiased`}
        data-reduced-motion={prefersReducedMotion}
      >
        {children}
      </body>
    </html>
  );
}
