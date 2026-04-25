import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { BackgroundBeams } from "@/components/background-beams";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Lumen NEX",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <BackgroundBeams />

      {/* Desktop sidebar */}
      <div className="hidden md:flex relative z-10 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
