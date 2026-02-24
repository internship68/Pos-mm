"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";
import { Product } from "@/types/product.type";

export default function AdminInventoryPage() {
    const queryClient = useQueryClient();
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { data: movements, isLoading: movementsLoading } = useQuery({
        queryKey: ["inventory-movements"],
        queryFn: async () => {
            const res = await api.get("/inventory/movements");
            return res.data;
        },
    });

    const { data: products } = useQuery<Product[]>({
        queryKey: ["products-active"],
        queryFn: async () => {
            const res = await api.get("/products");
            return res.data;
        },
    });

    const adjustStockMutation = useMutation({
        mutationFn: async (data: { productId: string; type: string; quantity: number; reason: string }) => {
            return api.post("/inventory/update", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["products-active"] });
            queryClient.invalidateQueries({ queryKey: ["products-admin"] });
            setIsAdjustModalOpen(false);
            alert("ปรับปรุงสต็อกสำเร็จ!");
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">จัดการสต็อกสินค้า</h1>
                    <p className="text-sm text-slate-500 mt-1">ติดตามการเคลื่อนไหวของสินค้าเข้า-ออก และปรับปรุงยอดสินค้าคงเหลือ</p>
                </div>
                <button
                    onClick={() => setIsAdjustModalOpen(true)}
                    className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:scale-[1.05] transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    ปรับปรุงสต็อก (Manual)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Movement Logs */}
                <div className="lg:col-span-2 glass rounded-3xl overflow-hidden border-slate-200 shadow-xl">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-primary-600">ประวัติการเคลื่อนไหวสต็อก</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">วัน-เวลา</th>
                                    <th className="px-6 py-4">สินค้า</th>
                                    <th className="px-6 py-4">ประเภท</th>
                                    <th className="px-6 py-4 text-right">จำนวน</th>
                                    <th className="px-6 py-4">เหตุผล</th>
                                    <th className="px-6 py-4">ผู้ทำรายการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {movementsLoading ? (
                                    <tr><td colSpan={6} className="text-center py-10 animate-pulse uppercase tracking-widest text-slate-300 font-bold">กำลังโหลด...</td></tr>
                                ) : movements?.map((m: any) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            {new Date(m.createdAt).toLocaleString('th-TH', {
                                                day: '2-digit', month: '2-digit', year: '2-digit',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{m.product?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${m.type === 'IN' ? 'bg-emerald-50 text-emerald-600' :
                                                    m.type === 'OUT' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {m.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-black ${m.type === 'IN' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                            {m.type === 'IN' ? '+' : '-'}{m.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs italic">{m.reason || "-"}</td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{m.user?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Info Card */}
                <div className="space-y-6">
                    <div className="glass rounded-3xl p-8 border-slate-200">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-6 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            แจ้งเตือนสินค้าใกล้หมด
                        </h3>
                        <div className="space-y-4">
                            {products?.filter(p => p.stockQuantity <= p.lowStockThreshold).map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{p.name}</p>
                                        <p className="text-xs text-amber-600">คงเหลือเพียง {p.stockQuantity}</p>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedProduct(p); setIsAdjustModalOpen(true); }}
                                        className="bg-white p-2 rounded-xl text-amber-600 shadow-sm hover:scale-105 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isAdjustModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="glass max-w-sm w-full rounded-3xl p-8 shadow-2xl border-white animate-in slide-in-from-bottom-5 duration-300">
                        <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">ปรับปรุงสต็อกสินค้า</h3>
                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            const data = {
                                productId: e.target.productId.value,
                                type: e.target.type.value,
                                quantity: parseInt(e.target.quantity.value),
                                reason: e.target.reason.value
                            };
                            adjustStockMutation.mutate(data);
                        }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">เลือกสินค้า</label>
                                <select name="productId" defaultValue={selectedProduct?.id} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                                    <option value="">เลือกสินค้า...</option>
                                    {products?.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (คงเหลือ: {p.stockQuantity})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ประเภทการเปลี่ยน</label>
                                    <select name="type" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                                        <option value="IN">รับสินค้าเข้า (+)</option>
                                        <option value="OUT">เอาสินค้าออก (-)</option>
                                        <option value="ADJUST">ปรับปรุงยอด (ADJUST)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">จำนวน</label>
                                    <input type="number" name="quantity" required min="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">เหตุผล / หมายเหตุ</label>
                                <textarea name="reason" placeholder="เช่น เติมสต็อก, สินค้าเสีย, ฯลฯ" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none h-20" />
                            </div>
                            <div className="flex justify-between items-center pt-6 space-x-4">
                                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="font-bold text-slate-400 uppercase text-xs">ยกเลิก</button>
                                <button type="submit" disabled={adjustStockMutation.isPending} className="flex-1 gradient-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                                    {adjustStockMutation.isPending ? "กำลังบันทึก..." : "ยืนยันการปรับสต็อก"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
