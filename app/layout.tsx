import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumen NEX — Autonomous Business Orchestrator",
  description:
    "Lumen NEX is an AI-powered autonomous business orchestrator for creators and SMEs. Automate revenue, tasks, and market intelligence in one dashboard.",
  keywords: ["AI", "business automation", "revenue", "SME", "orchestrator", "agents"],
  authors: [{ name: "Lumen NEX" }],
  openGraph: {
    title: "Lumen NEX",
    description: "Autonomous Business Orchestrator powered by AI",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} style={{ background: "#08090c" }}>
      <body className="font-sans antialiased" style={{ background: "#08090c", color: "#f0f2f8" }}>
        {children}
      </body>
    </html>
  );
}
