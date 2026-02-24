"use client";

import { useQuery } from "@tanstack/react-query";
import { saleService } from "@/services/sale.service";
import { useState } from "react";
import { Sale } from "@/types/sale.type";

export default function AdminReceiptsPage() {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    const { data: sales, isLoading } = useQuery({
        queryKey: ["sales-receipts"],
        queryFn: saleService.findAll,
    });

    return (
        <>
            <div className="mb-10">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">ใบเสร็จและการขาย</h1>
                <p className="text-sm text-slate-500 mt-1">ดูใบเสร็จ และประวัติการขายทั้งหมด</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden border-slate-200 shadow-xl">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">ใบเสร็จล่าสุด</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-6 py-4">วัน-เวลา</th>
                                <th className="px-6 py-4">เลขที่ใบเสร็จ</th>
                                <th className="px-6 py-4">วิธีชำระ</th>
                                <th className="px-6 py-4 text-right">ยอดรวม</th>
                                <th className="px-6 py-4 text-center">พนักงาน</th>
                                <th className="px-6 py-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-20 animate-pulse text-slate-300 font-bold uppercase tracking-widest">กำลังโหลดข้อมูล...</td></tr>
                            ) : sales?.map((sale) => (
                                <tr key={sale.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                        {new Date(sale.createdAt).toLocaleString('th-TH')}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">#{sale.id.substring(0, 8).toUpperCase()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                            sale.paymentMethod === 'CASH' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                            {sale.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-primary-600">฿{Number(sale.totalAmount).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm">
                                                {sale.cashier?.name?.charAt(0) || "U"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedSale(sale)}
                                            className="text-primary-500 font-bold text-xs hover:underline uppercase tracking-tighter"
                                        >
                                            ดูใบเสร็จ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="glass max-w-md w-full rounded-3xl p-8 shadow-2xl border-white overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900 leading-none">ใบเสร็จ</h2>
                            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest">#{selectedSale.id}</p>
                            <p className="text-sm text-slate-600 mt-1">{new Date(selectedSale.createdAt).toLocaleString('th-TH')}</p>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-8">
                            {selectedSale.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm leading-tight">{item.product?.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 font-mono">฿{Number(item.priceAtSale).toLocaleString()} x {item.quantity}</p>
                                    </div>
                                    <span className="font-black text-slate-800 ml-4 text-sm">฿{(Number(item.priceAtSale) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-dashed border-slate-200 pt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">ชำระโดย</span>
                                <span className="text-slate-900 font-black tracking-tight">{selectedSale.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-900">
                                <span className="font-black uppercase tracking-widest text-xs">ยอดรวมทั้งสิ้น</span>
                                <span className="text-3xl font-black tracking-tighter text-primary-600 font-mono">฿{Number(selectedSale.totalAmount).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-50">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}