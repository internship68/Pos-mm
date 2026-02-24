"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState, useRef, useEffect } from "react";
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
        },
    });

    const lowStockProducts = products?.filter((p) => p.stockQuantity <= p.lowStockThreshold) ?? [];

    return (
        <div className="min-h-screen bg-[#F7F7F5] px-8 py-10">

            {/* ===================== HEADER ===================== */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-1">คลังสินค้า</p>
                    <h1 className="text-3xl font-semibold text-stone-800 tracking-tight">จัดการสต็อก</h1>
                    <p className="text-sm text-stone-400 mt-1.5">
                        ติดตามการเคลื่อนไหวสินค้าเข้า-ออก และปรับปรุงยอดสินค้าคงเหลือ
                    </p>
                </div>

                <button
                    onClick={() => { setSelectedProduct(null); setIsAdjustModalOpen(true); }}
                    className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    ปรับปรุงสต็อก
                </button>
            </div>

            {/* ===================== CONTENT ===================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ---------- Movement Log Table ---------- */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-0.5">บันทึก</p>
                            <h3 className="text-sm font-semibold text-stone-800">ประวัติการเคลื่อนไหวสต็อก</h3>
                        </div>
                        {movements?.length > 0 && (
                            <span className="text-xs text-stone-400">
                                {movements.length} รายการ
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50/60 border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">วัน-เวลา</th>
                                    <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">สินค้า</th>
                                    <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">ประเภท</th>
                                    <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest text-right">จำนวน</th>
                                    <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">เหตุผล</th>
                                    <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">ผู้ทำรายการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {movementsLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: 6 }).map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-3 bg-stone-100 rounded animate-pulse" style={{ width: j === 1 ? "8rem" : "4rem" }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : movements?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3 text-stone-300">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <span className="text-sm">ยังไม่มีประวัติการเคลื่อนไหว</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    movements?.map((m: any) => (
                                        <tr key={m.id} className="hover:bg-stone-50/60 transition-colors duration-100">
                                            <td className="px-6 py-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                                                {new Date(m.createdAt).toLocaleString("th-TH", {
                                                    day: "2-digit", month: "2-digit", year: "2-digit",
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-stone-800 text-sm">
                                                {m.product?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    m.type === "IN"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : m.type === "OUT"
                                                        ? "bg-orange-50 text-orange-500"
                                                        : "bg-stone-100 text-stone-500"
                                                }`}>
                                                    {m.type === "IN" ? "▲" : m.type === "OUT" ? "▼" : "~"} {m.type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-semibold tabular-nums ${
                                                m.type === "IN" ? "text-emerald-600" : "text-stone-700"
                                            }`}>
                                                {m.type === "IN" ? "+" : m.type === "OUT" ? "−" : ""}{m.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-stone-400 text-xs italic max-w-[140px] truncate">
                                                {m.reason || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 text-sm">
                                                {m.user?.name || "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ---------- Low Stock Alert Panel ---------- */}
                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            <div>
                                <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-0.5">แจ้งเตือน</p>
                                <h3 className="text-sm font-semibold text-stone-800">สินค้าใกล้หมด</h3>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        {lowStockProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">สต็อกทุกรายการปกติ</span>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {lowStockProducts.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-orange-50 border border-orange-100 group"
                                    >
                                        <div className="min-w-0 mr-3">
                                            <p className="font-medium text-stone-800 text-sm truncate leading-tight">
                                                {p.name}
                                            </p>
                                            <p className="text-xs text-orange-500 mt-0.5">
                                                คงเหลือเพียง <span className="font-semibold">{p.stockQuantity}</span> ชิ้น
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedProduct(p); setIsAdjustModalOpen(true); }}
                                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-500 border border-orange-100 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-150 shadow-sm"
                                            title="เติมสต็อก"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===================== MODAL ===================== */}
            {isAdjustModalOpen && (
                <AdjustModal
                    products={products ?? []}
                    selectedProduct={selectedProduct}
                    isPending={adjustStockMutation.isPending}
                    onClose={() => { setIsAdjustModalOpen(false); setSelectedProduct(null); }}
                    onSubmit={(data) => adjustStockMutation.mutate(data)}
                />
            )}
        </div>
    );
}

/* ============================================================
   ADJUST MODAL
   ============================================================ */
function AdjustModal({
    products,
    selectedProduct,
    isPending,
    onClose,
    onSubmit,
}: {
    products: Product[];
    selectedProduct: Product | null;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (data: { productId: string; type: string; quantity: number; reason: string }) => void;
}) {
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(20,18,16,0.5)", backdropFilter: "blur(6px)" }}
            onClick={(e) => e.target === backdropRef.current && onClose()}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1)" }}
            >
                {/* Top accent */}
                <div className="h-px w-full bg-gradient-to-r from-[#6B7CFF] via-[#9BA7FF] to-transparent" />

                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-stone-100">
                    <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-1 font-medium">สต็อก</p>
                        <h2 className="text-lg font-semibold text-stone-800 tracking-tight">ปรับปรุงสต็อกสินค้า</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-0.5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        onSubmit({
                            productId: e.target.productId.value,
                            type: e.target.type.value,
                            quantity: parseInt(e.target.quantity.value),
                            reason: e.target.reason.value,
                        });
                    }}
                    className="px-7 py-6 space-y-5"
                >
                    {/* เลือกสินค้า */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-500 tracking-wide">
                            เลือกสินค้า<span className="text-[#6B7CFF] ml-0.5">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="productId"
                                defaultValue={selectedProduct?.id ?? ""}
                                required
                                className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]/25 focus:border-[#6B7CFF] transition cursor-pointer pr-10"
                            >
                                <option value="" disabled>เลือกสินค้า...</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (คงเหลือ: {p.stockQuantity})
                                    </option>
                                ))}
                            </select>
                            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>

                    {/* ประเภท + จำนวน */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-stone-500 tracking-wide">ประเภท<span className="text-[#6B7CFF] ml-0.5">*</span></label>
                            <div className="relative">
                                <select
                                    name="type"
                                    className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]/25 focus:border-[#6B7CFF] transition cursor-pointer pr-8"
                                >
                                    <option value="IN">รับเข้า (+)</option>
                                    <option value="OUT">เอาออก (−)</option>
                                    <option value="ADJUST">ปรับยอด</option>
                                </select>
                                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-stone-500 tracking-wide">จำนวน<span className="text-[#6B7CFF] ml-0.5">*</span></label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min="1"
                                placeholder="0"
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]/25 focus:border-[#6B7CFF] transition"
                            />
                        </div>
                    </div>

                    {/* เหตุผล */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-500 tracking-wide">เหตุผล / หมายเหตุ</label>
                        <textarea
                            name="reason"
                            rows={3}
                            placeholder="เช่น เติมสต็อก, สินค้าเสีย, นับสต็อกใหม่..."
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]/25 focus:border-[#6B7CFF] transition resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100 rounded-xl transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                        >
                            {isPending ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    ยืนยันการปรับสต็อก
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(14px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}