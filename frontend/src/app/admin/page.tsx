"use client";

import AdminLayout from "@/components/layout/AdminLayout";
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

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="ยอดขายวันนี้"
                    value={isLoading ? "..." : `฿${summary?.salesToday?.toLocaleString() || 0}`}
                    icon={MoneyIcon}
                    trend="+12%"
                    color="bg-primary-500"
                />
                <StatCard
                    title="กำไรขั้นต้น"
                    value={isLoading ? "..." : `฿${summary?.grossProfitToday?.toLocaleString() || 0}`}
                    icon={ProfitIcon}
                    trend="+5%"
                    color="bg-emerald-500"
                />
                <StatCard
                    title="สินค้าใกล้หมด"
                    value={isLoading ? "..." : summary?.lowStockItems || 0}
                    icon={AlertIcon}
                    trend={summary?.lowStockItems > 0 ? "ต้องเติมด่วน" : "ปกติ"}
                    color="bg-amber-500"
                />
                <StatCard
                    title="จำนวนสินค้าทั้งหมด"
                    value={isLoading ? "..." : summary?.totalProducts || 0}
                    icon={PackageIcon}
                    trend="รายการ"
                    color="bg-slate-800"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass rounded-3xl p-8 border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">ยอดขาย 7 วันล่าสุด</h3>
                        <div className="flex space-x-2">
                            <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                            <span className="text-xs font-bold text-slate-400 uppercase">รายได้</span>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between px-4 space-x-2">
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full bg-primary-100 rounded-t-xl group-hover:bg-primary-500 transition-all duration-500 relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ฿{(h * 1000).toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">สินค้าขายดี</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0"></div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 text-sm">สินค้าตัวอย่าง {i}</p>
                                    <p className="text-primary-600 text-xs font-bold">฿1,200 <span className="text-slate-400 font-medium">x 45</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-300">#0{i}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
    return (
        <div className="glass p-6 rounded-3xl border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-slate-500 font-medium text-sm">{title}</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
        </div>
    );
}

function MoneyIcon(props: any) {
    return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15" /></svg>;
}
function ProfitIcon(props: any) {
    return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
}
function AlertIcon(props: any) {
    return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
}
function PackageIcon(props: any) {
    return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
}
