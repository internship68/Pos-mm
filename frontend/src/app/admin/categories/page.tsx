"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useState } from "react";
import { Category } from "@/types/category.type";
import { useForm } from "react-hook-form";

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories-admin"],
        queryFn: categoryService.findAll,
    });

    const createMutation = useMutation({
        mutationFn: categoryService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
            categoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
            setIsModalOpen(false);
            setEditingCategory(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: categoryService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("ยืนยันการลบหมวดหมู่นี้? สินค้าในหมวดหมู่นี้จะไม่ถูกลบแต่จะไม่มีหมวดหมู่ระบุ")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">จัดการหมวดหมู่สินค้า</h1>
                    <p className="text-sm text-slate-500 mt-1">จัดกลุ่มสินค้าเพื่อให้ง่ายต่อการค้นหาและการขาย</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
                    className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:scale-[1.05] transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มหมวดหมู่ใหม่
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold tracking-widest animate-pulse">กำลังโหลดข้อมูล...</div>
                ) : categories?.map((cat) => (
                    <div key={cat.id} className="glass group rounded-3xl p-6 border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-black">
                                    {cat.name.charAt(0)}
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{cat.name}</h3>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{cat.description || "ไม่มีคำอธิบาย"}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs font-black text-primary-500 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                                {cat.products?.length || 0} รายการสินค้า
                            </span>
                            <span className="text-[10px] text-slate-300 font-mono italic">ID: {cat.id.substring(0, 8)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-sans">
                    <div className="glass max-w-sm w-full rounded-3xl p-8 shadow-2xl border-white">
                        <h3 className="text-2xl font-black text-slate-800 mb-6">{editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}</h3>
                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            const data = {
                                name: e.target.name.value,
                                description: e.target.description.value
                            };
                            if (editingCategory) {
                                updateMutation.mutate({ id: editingCategory.id, data });
                            } else {
                                createMutation.mutate(data);
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ชื่อหมวดหมู่</label>
                                <input name="name" defaultValue={editingCategory?.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">คำอธิบาย</label>
                                <textarea name="description" defaultValue={editingCategory?.description} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none h-24" />
                            </div>
                            <div className="flex justify-between items-center pt-6 space-x-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="font-bold text-slate-400 uppercase text-xs">ยกเลิก</button>
                                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 gradient-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                                    {(createMutation.isPending || updateMutation.isPending) ? "กำลังส่งข้อมูล..." : (editingCategory ? "บันทึกการแก้ไข" : "สร้างหมวดหมู่")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
