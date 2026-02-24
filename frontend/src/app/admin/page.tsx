"use client";

import type { SVGProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export default function AdminDashboard() {
    const { data: summary, isLoading } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const res = await api.get("/dashboard/summary");
            return res.data;
        },
    });

    const weeklySales = summary?.weeklySales || [];
    const maxSales = weeklySales.length ? Math.max(...weeklySales) : 0;

    return (
        <div className="h-full bg-[#F7F7F5] px-8 py-10 space-y-10 font-[family-name:var(--font-body)]">

            {/* ===================== HEADER ===================== */}
            <header className="flex items-end justify-between">
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-1">แดชบอร์ด</p>
                    <h1 className="text-3xl font-semibold text-stone-800 tracking-tight">ภาพรวมวันนี้</h1>
                </div>
                <span className="text-xs text-stone-400 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-sm">
                    {new Date().toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
            </header>

            {/* ===================== STAT CARDS ===================== */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    title="ยอดขายวันนี้"
                    value={isLoading ? "—" : `฿${summary?.salesToday?.toLocaleString() || 0}`}
                    icon={MoneyIcon}
                    trend={summary?.salesTrend || "0%"}
                    accent="#6B7CFF"
                    accentLight="#EDEEFF"
                />
                <StatCard
                    title="กำไรขั้นต้น"
                    value={isLoading ? "—" : `฿${summary?.grossProfitToday?.toLocaleString() || 0}`}
                    icon={ProfitIcon}
                    trend={summary?.profitTrend || "0%"}
                    accent="#4DAD8D"
                    accentLight="#E7F5F0"
                />
                <StatCard
                    title="สินค้าใกล้หมด"
                    value={isLoading ? "—" : summary?.lowStockItems || 0}
                    icon={AlertIcon}
                    trend={summary?.lowStockItems > 0 ? "ต้องเติมด่วน" : "ปกติ"}
                    accent="#E88C4A"
                    accentLight="#FEF1E6"
                />
                <StatCard
                    title="สินค้าทั้งหมด"
                    value={isLoading ? "—" : summary?.totalProducts || 0}
                    icon={PackageIcon}
                    trend="รายการ"
                    accent="#8A8A9A"
                    accentLight="#F0F0F4"
                />
            </section>

            {/* ===================== CHART + TOP PRODUCTS ===================== */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ---------- Weekly Sales Chart ---------- */}
                <div className="xl:col-span-2 bg-white rounded-2xl p-8 border border-stone-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-stone-400">กราฟ</p>
                            <h3 className="text-lg font-semibold text-stone-800 mt-0.5">ยอดขาย 7 วันล่าสุด</h3>
                        </div>
                        {maxSales > 0 && (
                            <span className="text-xs text-stone-400">
                                สูงสุด ฿{maxSales.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className="h-56 flex items-end gap-3">
                        {weeklySales.length > 0 ? (
                            weeklySales.map((sales: number, i: number) => {
                                const pct = maxSales ? (sales / maxSales) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full flex items-end" style={{ height: "100%" }}>
                                            {/* Background track */}
                                            <div className="absolute bottom-0 w-full h-full bg-stone-100 rounded-xl" />
                                            {/* Fill bar */}
                                            <div
                                                className="relative w-full rounded-xl transition-all duration-500"
                                                style={{
                                                    height: `${pct}%`,
                                                    background: "linear-gradient(180deg, #6B7CFF 0%, #8B97FF 100%)",
                                                    opacity: 0.85,
                                                }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                                                    ฿{sales.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-stone-400 font-medium">
                                            {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"][i] || `D${i + 1}`}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center gap-2 text-stone-300">
                                <BarChartEmptyIcon className="w-12 h-12" />
                                <span className="text-sm">ไม่มีข้อมูลยอดขาย</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ---------- Top Products ---------- */}
                <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-sm">
                    <div className="mb-6">
                        <p className="text-xs tracking-widest uppercase text-stone-400">อันดับ</p>
                        <h3 className="text-lg font-semibold text-stone-800 mt-0.5">สินค้าขายดี</h3>
                    </div>

                    <div className="space-y-1">
                        {summary?.topProducts?.length > 0 ? (
                            summary.topProducts.map((product: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-3.5 border-b border-stone-100 last:border-0 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-xs font-bold w-5 text-center"
                                            style={{ color: i === 0 ? "#6B7CFF" : i === 1 ? "#4DAD8D" : "#C0BFBE" }}
                                        >
                                            {i + 1}
                                        </span>
                                        <div>
                                            <p className="font-medium text-stone-800 text-sm leading-tight">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                ฿{product.price?.toLocaleString()} × {product.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-stone-700">
                                        ฿{(product.price * product.quantity)?.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-stone-300 text-sm">
                                ยังไม่มีข้อมูล
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ===================== STAT CARD ===================== */

function StatCard({ title, value, icon: Icon, trend, accent, accentLight }: any) {
    const isAlert = trend?.includes("ต้องเติม");
    const isPositive = trend?.includes("+");

    return (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <div className="flex items-start justify-between mb-5">
                <div
                    className="p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-105"
                    style={{ background: accentLight }}
                >
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide ${
                        isAlert
                            ? "bg-orange-50 text-orange-500"
                            : isPositive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-stone-100 text-stone-400"
                    }`}
                >
                    {trend}
                </span>
            </div>

            <p className="text-xs text-stone-400 tracking-wide uppercase">{title}</p>
            <h4 className="text-2xl font-semibold text-stone-800 mt-1.5 tabular-nums">{value}</h4>

            {/* Bottom accent line */}
            <div
                className="mt-5 h-0.5 w-8 rounded-full opacity-40 group-hover:w-16 group-hover:opacity-70 transition-all duration-300"
                style={{ background: accent }}
            />
        </div>
    );
}

/* ===================== ICONS ===================== */

function MoneyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v12" />
            <path d="M15 9H10.5a2 2 0 0 0 0 4H13.5a2 2 0 0 1 0 4H9" />
        </svg>
    );
}

function ProfitIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="3 17 9 11 13 15 20 8" />
            <polyline points="14 8 20 8 20 14" />
        </svg>
    );
}

function AlertIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M10.3 3.6 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function BarChartEmptyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="2" y="14" width="4" height="7" rx="1" />
            <rect x="10" y="9" width="4" height="12" rx="1" />
            <rect x="18" y="4" width="4" height="17" rx="1" />
            <line x1="2" y1="22" x2="22" y2="22" />
        </svg>
    );
}