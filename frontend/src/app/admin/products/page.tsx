"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { useState } from "react";
import { Product } from "@/types/product.type";
import { CreateProductDto } from "@/types/dtos";
import { useForm } from "react-hook-form";

export default function AdminProductsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data: products, isLoading } = useQuery({
        queryKey: ["products-admin"],
        queryFn: productService.findAll,
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.findAll,
    });

    const createMutation = useMutation({
        mutationFn: productService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-admin"] });
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductDto> }) =>
            productService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-admin"] });
            setIsModalOpen(false);
            setEditingProduct(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: productService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-admin"] });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("ยืนยันการลบสินค้านี้?")) {
            deleteMutation.mutate(id);
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">จัดการสินค้า</h1>
                    <p className="text-sm text-slate-500 mt-1">เพิ่ม แก้ไข หรือลบรายการสินค้าในระบบ</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:scale-[1.05] transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มสินค้าใหม่
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden border-slate-200 shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">สินค้า</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">ราคาทุน</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">ราคาขาย</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">สต็อก</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">กำลังโหลดข้อมูล...</td></tr>
                        ) : products?.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 mr-4 flex-shrink-0 overflow-hidden border border-slate-200">
                                            {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{product.name}</p>
                                            <p className="text-xs text-slate-400 font-mono mt-0.5">{product.barcode || "ไม่มีบาร์โค้ด"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                        {product.category?.name || "ทั่วไป"}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right font-medium text-slate-500">฿{Number(product.costPrice).toLocaleString()}</td>
                                <td className="px-6 py-5 text-right font-black text-primary-600">฿{Number(product.sellPrice).toLocaleString()}</td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${product.stockQuantity <= product.lowStockThreshold
                                            ? "bg-red-50 text-red-600 animate-pulse"
                                            : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                        {product.stockQuantity} {product.stockQuantity <= product.lowStockThreshold ? "Low Stock" : "In Stock"}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(product)} className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ProductModal
                    categories={categories || []}
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(data: CreateProductDto) => {
                        if (editingProduct) {
                            updateMutation.mutate({ id: editingProduct.id, data });
                        } else {
                            createMutation.mutate(data as CreateProductDto);
                        }
                    }}
                    isPending={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </AdminLayout>
    );
}

function ProductModal({ categories, product, onClose, onSubmit, isPending }: any) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: product ? {
            ...product,
            costPrice: Number(product.costPrice),
            sellPrice: Number(product.sellPrice)
        } : {}
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="glass max-w-lg w-full rounded-3xl p-8 shadow-2xl border-white animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-black text-slate-800 mb-6">
                    {product ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ชื่อสินค้า</label>
                            <input {...register("name", { required: "กรุณากรอกชื่อสินค้า" })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">บาร์โค้ด</label>
                            <input {...register("barcode")} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="ไม่ต้องกรอกหากไม่มี" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ราคาทุน</label>
                            <input type="number" step="0.01" {...register("costPrice", { required: true, valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ราคาขาย</label>
                            <input type="number" step="0.01" {...register("sellPrice", { required: true, valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">หมวดหมู่</label>
                            <select {...register("categoryId", { required: true })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">แจ้งเตือนสินค้าต่ำกว่า</label>
                            <input type="number" {...register("lowStockThreshold", { valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" defaultValue={5} />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase text-sm">ยกเลิก</button>
                        <button type="submit" disabled={isPending} className="flex-1 gradient-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                            {isPending ? "กำลังส่งข้อมูล..." : (product ? "บันทึกการแก้ไข" : "เพิ่มสินค้าเข้าระบบ")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
