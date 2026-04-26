"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Shield, Bell, Zap, CreditCard, LogOut,
  Globe, Smartphone, CheckCircle2, AlertCircle,
  ChevronRight, Lock
} from "lucide-react";

// Tipos para las secciones
type Section = "profile" | "security" | "notifications" | "agent" | "billing" | "payments";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("agent");
  const [isAutonomous, setIsAutonomous] = useState(true);
  const [reasoningDepth, setReasoningDepth] = useState(4096);

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col gap-8" style={{ background: "#020617" }}>
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Strategic Settings</h1>
        <p className="text-slate-400 text-sm mt-2">
          Configure your autonomous business infrastructure and agent behavior.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- Sidebar Navigation --- */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <NavButton
            icon={User} label="Profile" sub="Personal identity and details"
            active={activeSection === "profile"} onClick={() => setActiveSection("profile")}
          />
          <NavButton
            icon={Shield} label="Security" sub="Passwords, 2FA and sessions"
            active={activeSection === "security"} onClick={() => setActiveSection("security")}
          />
          <NavButton
            icon={Bell} label="Notifications" sub="Alerts, email and push"
            active={activeSection === "notifications"} onClick={() => setActiveSection("notifications")}
          />
          <NavButton
            icon={Zap} label="Agent Controls" sub="Reasoning depth and automation"
            active={activeSection === "agent"} onClick={() => setActiveSection("agent")}
          />
          <NavButton
            icon={CreditCard} label="Billing" sub="Subscription and methods"
            active={activeSection === "billing"} onClick={() => setActiveSection("billing")}
          />

          <button className="mt-4 flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-red-500">Sign Out</span>
          </button>
        </div>

        {/* --- Content Area --- */}
        <main className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeSection === "agent" && (
              <motion.div
                key="agent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-3xl"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white">Agent Configuration</h2>
                </div>

                <div className="space-y-10">
                  {/* Autonomous Toggle */}
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/2 border border-white/5">
                    <div>
                      <h4 className="text-white font-medium">Autonomous Mode</h4>
                      <p className="text-xs text-slate-500 mt-1">Allow agent to respond to WhatsApp messages automatically.</p>
                    </div>
                    <button
                      onClick={() => setIsAutonomous(!isAutonomous)}
                      className={`w-12 h-6 rounded-full transition-all relative ${isAutonomous ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                      <motion.div
                        animate={{ x: isAutonomous ? 26 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  {/* Reasoning Depth */}
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h4 className="text-white font-medium text-sm">Reasoning Depth</h4>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Deep ({reasoningDepth} tokens)</span>
                    </div>
                    <input
                      type="range" min="1024" max="8192" step="1024"
                      value={reasoningDepth}
                      onChange={(e) => setReasoningDepth(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Connected Intelligence: Payment Tools */}
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Connected Intelligence</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-slate-300 hover:bg-emerald-500/10 transition-all text-sm">
                        <Globe className="w-4 h-4 text-emerald-400" /> Live Web Search
                      </button>
                      <button
                        onClick={() => setActiveSection("payments")}
                        className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all text-sm"
                      >
                        <CreditCard className="w-4 h-4 text-indigo-400" /> Payment Tools
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-3xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setActiveSection("agent")} className="text-slate-500 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h2 className="text-xl font-bold text-white">Payment Infrastructure</h2>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-8 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-200/70 leading-relaxed">
                    <strong>Paradox Alert:</strong> La integración de Yape/Mercado Pago requiere la captura manual del OTP.
                    El agente entrará en estado de "espera" cuando detecte una transacción pendiente.
                  </p>
                </div>

                <div className="space-y-4">
                  <PaymentProviderCard
                    name="Yape / Mercado Pago"
                    status="Connected"
                    icon={Smartphone}
                    connected
                  />
                  <PaymentProviderCard
                    name="Stripe Global"
                    status="Not Configured"
                    icon={Globe}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* --- Sub-componentes para Limpieza de Código --- */

function NavButton({ icon: Icon, label, sub, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${active
        ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
        : "bg-white/2 border-white/5 hover:bg-white/5"
        }`}
    >
      <div className={`p-2 rounded-xl ${active ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400"}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className={`text-sm font-semibold ${active ? "text-white" : "text-slate-300"}`}>{label}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
      </div>
    </button>
  );
}

function PaymentProviderCard({ name, status, icon: Icon, connected }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${connected ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-500"}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-600"}`} />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{status}</span>
          </div>
        </div>
      </div>
      <button className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${connected ? "bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-500" : "bg-indigo-600 text-white hover:bg-indigo-500"
        }`}>
        {connected ? "Disconnect" : "Configure"}
      </button>
    </div>
  );
}