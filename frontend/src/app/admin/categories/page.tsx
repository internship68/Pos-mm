"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useState, useRef, useEffect } from "react";
import { Category } from "@/types/category.type";

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.findAll,
    });

    const createMutation = useMutation({
        mutationFn: categoryService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
            categoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsModalOpen(false);
            setEditingCategory(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: categoryService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("ยืนยันการลบหมวดหมู่นี้? สินค้าในหมวดหมู่นี้จะไม่ถูกลบแต่จะไม่มีหมวดหมู่ระบุ")) {
            deleteMutation.mutate(id);
        }
    };

    const openCreate = () => { setEditingCategory(null); setIsModalOpen(true); };
    const openEdit = (cat: Category) => { setEditingCategory(cat); setIsModalOpen(true); };



    return (
        <div className="min-h-screen bg-[#F7F7F5] px-8 py-10">

            {/* ===================== HEADER ===================== */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-1">ระบบ</p>
                    <h1 className="text-3xl font-semibold text-stone-800 tracking-tight">
                        จัดการหมวดหมู่
                    </h1>
                    <p className="text-sm text-stone-400 mt-1.5">
                        จัดกลุ่มสินค้าเพื่อให้ง่ายต่อการค้นหาและการขาย
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                    <span className="text-lg leading-none">+</span>
                    เพิ่มหมวดหมู่ใหม่
                </button>
            </div>

            {/* ===================== GRID ===================== */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-28 h-4 bg-stone-100 rounded animate-pulse" />
                                <div className="flex gap-1.5">
                                    <div className="w-8 h-8 rounded-lg bg-stone-100 animate-pulse" />
                                    <div className="w-8 h-8 rounded-lg bg-stone-100 animate-pulse" />
                                </div>
                            </div>
                            <div className="w-40 h-3 bg-stone-100 rounded animate-pulse mb-2" />
                            <div className="w-40 h-3 bg-stone-100 rounded animate-pulse" />
                            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between">
                                <div className="w-20 h-5 bg-stone-100 rounded-full animate-pulse" />
                                <div className="w-16 h-3 bg-stone-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-stone-300">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <p className="text-sm">ยังไม่มีหมวดหมู่ในระบบ</p>
                    <button onClick={openCreate} className="text-xs text-[#6B7CFF] hover:underline mt-1">
                        + เพิ่มหมวดหมู่แรก
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories?.map((cat) => {
                        const count = cat._count?.products ?? cat.products?.length ?? 0;

                        return (
                            <div
                                key={cat.id}
                                className="group bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top row */}
                                    <div className="flex justify-between items-start mb-5">
                                        <h3 className="text-base font-semibold text-stone-800 leading-tight">
                                            {cat.name}
                                        </h3>

                                        {/* Action buttons — visible on hover */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 ml-3">
                                            <button
                                                onClick={() => openEdit(cat)}
                                                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                                                title="แก้ไข"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="ลบ"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6" />
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-stone-400 mt-1 leading-relaxed line-clamp-2">
                                        {cat.description || "ไม่มีคำอธิบาย"}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-500">
                                        {count} รายการสินค้า
                                    </span>
                                    <div className="h-0.5 w-0 group-hover:w-8 rounded-full bg-stone-300 transition-all duration-300" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ===================== MODAL ===================== */}
            {isModalOpen && (
                <CategoryModal
                    editing={editingCategory}
                    isPending={createMutation.isPending || updateMutation.isPending}
                    onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
                    onSubmit={(data) => {
                        if (editingCategory) {
                            updateMutation.mutate({ id: editingCategory.id, data });
                        } else {
                            createMutation.mutate(data);
                        }
                    }}
                />
            )}
        </div>
    );
}

/* ============================================================
   MODAL
   ============================================================ */
function CategoryModal({
    editing,
    isPending,
    onClose,
    onSubmit,
}: {
    editing: Category | null;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string }) => void;
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
                        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-1 font-medium">
                            {editing ? "แก้ไขข้อมูล" : "เพิ่มใหม่"}
                        </p>
                        <h2 className="text-lg font-semibold text-stone-800 tracking-tight">
                            {editing ? editing.name : "เพิ่มหมวดหมู่ใหม่"}
                        </h2>
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
                        onSubmit({ name: e.target.name.value, description: e.target.description.value });
                    }}
                    className="px-7 py-6 space-y-5"
                >
                    {/* ชื่อ */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-500 tracking-wide">
                            ชื่อหมวดหมู่<span className="text-[#6B7CFF] ml-0.5">*</span>
                        </label>
                        <input
                            name="name"
                            defaultValue={editing?.name}
                            required
                            placeholder="เช่น เครื่องดื่ม, ขนมขบเคี้ยว"
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]/25 focus:border-[#6B7CFF] transition"
                        />
                    </div>

                    {/* คำอธิบาย */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-500 tracking-wide">
                            คำอธิบาย
                        </label>
                        <textarea
                            name="description"
                            defaultValue={editing?.description}
                            rows={3}
                            placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
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
                                    {editing ? "บันทึกการแก้ไข" : "สร้างหมวดหมู่"}
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