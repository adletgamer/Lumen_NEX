"use client";

import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import {
    TrendingUp,
    Zap,
    User,
    ArrowUpRight,
    CreditCard,
    ShieldCheck
} from "lucide-react";

// Mock Data: Representando la transición hacia la autonomía
const revenueData = [
    { name: "Lun", ai: 400, manual: 800 },
    { name: "Mar", ai: 700, manual: 750 },
    { name: "Mie", ai: 1200, manual: 600 },
    { name: "Jue", ai: 1800, manual: 400 },
    { name: "Vie", ai: 2400, manual: 300 },
    { name: "Sab", ai: 3100, manual: 200 },
    { name: "Dom", ai: 3800, manual: 150 },
];

const stats = [
    { label: "Total Revenue", value: "S/ 12,450", icon: CreditCard, color: "#6366F1" },
    { label: "AI Efficiency", value: "94.2%", icon: Zap, color: "#A855F7" },
    { label: "Manual Fallback", value: "5.8%", icon: User, color: "#f43f5e" },
];

export default function RevenuePage() {
    return (
        <div className="min-h-screen p-6 space-y-8" style={{ background: "#020617" }}>
            {/* Header Estratégico */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
                        Revenue Intelligence
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Validación de solvencia digital bajo estándares SDG 8.10.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl text-xs font-medium border border-white/10 text-white bg-white/5 hover:bg-white/10 transition-all">
                        Exportar Auditoría
                    </button>
                    <button
                        className="px-4 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)" }}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Proof of Solvency
                    </button>
                </div>
            </div>

            {/* KPI Cards: El "Stress Test" del Negocio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="p-2 rounded-lg"
                                style={{ background: `${stat.color}15` }}
                            >
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +12.5%
                            </span>
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-500">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Gráfico Principal: AI vs Manual */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl border border-white/10 bg-white/2 backdrop-blur-2xl"
            >
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Atribución de Orquestación</h2>
                        <p className="text-sm text-slate-400">Comparativa de flujo autónomo (Lumen Agent) vs. intervención humana.</p>
                    </div>
                    <div className="flex gap-4 text-[10px] font-mono uppercase tracking-tighter">
                        <div className="flex items-center gap-2 text-[#A855F7]">
                            <div className="w-2 h-2 rounded-full bg-[#A855F7]" /> AI Revenue
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-slate-700" /> Manual
                        </div>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="ai"
                                stroke="#A855F7"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#aiGradient)"
                            />
                            <Area
                                type="monotone"
                                dataKey="manual"
                                stroke="#475569"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fill="transparent"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Footer de Integridad Técnica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Proyección de Crecimiento
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Basado en la reducción de latencia del OTP manual. La transición a la orquestación pura
                        estimada para Q3 reducirá el costo operativo en un 40%.
                    </p>
                </div>
                <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2">
                        Cumplimiento SDG 8.10
                    </h4>
                    <p className="text-xs text-emerald-100/60 leading-relaxed">
                        Estos datos son inmutables y están listos para ser utilizados como colateral digital
                        en instituciones financieras micro-crediticias.
                    </p>
                </div>
            </div>
        </div>
    );
}