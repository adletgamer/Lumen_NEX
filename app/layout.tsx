import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
      style={{ background: "#020617" }}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
