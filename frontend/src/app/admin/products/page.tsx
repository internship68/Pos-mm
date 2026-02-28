"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import ProductForm from "@/components/forms/ProductForm";
import { Product } from "@/types/product.type";
import type { Category } from "@/types/category.type";
import { CreateProductDto } from "@/types/dtos";

function ProductModal({
    categories,
    product,
    onClose,
    onSubmit,
    isPending,
}: {
    categories: Category[];
    product: Product | null;
    onClose: () => void;
    onSubmit: (data: CreateProductDto) => void;
    isPending: boolean;
}) {
    return (
        <Modal
            open
            title={product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            onClose={onClose}
            className="max-w-2xl"
        >
            <ProductForm
                categories={categories}
                defaultValues={
                    product
                        ? {
                            barcode: product.barcode,
                            name: product.name,
                            description: product.description,
                            costPrice: product.costPrice,
                            sellPrice: product.sellPrice,
                            stockQuantity: product.stockQuantity,
                            categoryId: product.categoryId,
                            imageUrl: product.imageUrl,
                            lowStockThreshold: product.lowStockThreshold,
                        }
                        : undefined
                }
                onSubmit={onSubmit}
                submitting={isPending}
            />
        </Modal>
    );
}

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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductDto> }) =>
            productService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-admin"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsModalOpen(false);
            setEditingProduct(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: productService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-admin"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
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
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 relative overflow-hidden px-4 md:px-8 py-10">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-[120px] pointer-events-none animate-float" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-accent-300/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* ===================== HEADER ===================== */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-bold tracking-widest uppercase mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                            Inventory System
                        </div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">
                            จัดการสินค้าในคลัง
                        </h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium">
                            เพิ่ม แก้ไข หรือลบรายการสินค้าในระบบอย่างง่ายดาย
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {(!categories || categories.length === 0) && (
                            <Link
                                href="/admin/categories"
                                className="w-full md:w-auto text-center px-5 py-2.5 glass border-accent-200 text-accent-600 rounded-xl text-sm font-semibold hover:bg-accent-50 transition-all shadow-sm hover:shadow-md"
                            >
                                + เพิ่มหมวดหมู่ก่อน
                            </Link>
                        )}

                        <button
                            onClick={openCreateModal}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 gradient-primary hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="text-lg leading-none">+</span>
                            เพิ่มสินค้าใหม่
                        </button>
                    </div>
                </div>

                {/* ===================== TABLE ===================== */}
                <div className="glass rounded-3xl border border-white/60 shadow-xl overflow-hidden backdrop-blur-2xl">

                    {/* Summary bar */}
                    {!isLoading && products && (
                        <div className="px-6 py-4 bg-white/40 border-b border-white/50 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100/50 border border-primary-200 rounded-xl text-primary-600 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <span className="text-sm text-slate-600 font-medium">
                                    ทั้งหมด <span className="text-slate-900 font-bold ml-1">{products.length}</span> รายการ
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 border border-red-100 rounded-xl text-red-500 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <span className="text-sm text-slate-600 font-medium">
                                    สินค้าใกล้หมด <span className="text-red-500 font-bold ml-1">{products.filter(p => p.stockQuantity <= p.lowStockThreshold).length}</span> รายการ
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/40 border-b border-white/50">
                                <tr>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">สินค้า</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden sm:table-cell whitespace-nowrap">หมวดหมู่</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right hidden lg:table-cell whitespace-nowrap">ราคาทุน</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">ราคาขาย</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center whitespace-nowrap">คงเหลือ</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">จัดการ</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200/40 bg-white/20">
                                {isLoading ? (
                                    /* Loading skeleton */
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-200/50 animate-pulse" />
                                                    <div className="space-y-2">
                                                        <div className="w-32 h-3 bg-slate-200/50 rounded-full animate-pulse" />
                                                        <div className="w-20 h-2 bg-slate-200/50 rounded-full animate-pulse" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 hidden sm:table-cell"><div className="w-16 h-4 bg-slate-200/50 rounded-full animate-pulse" /></td>
                                            <td className="px-6 py-5 hidden lg:table-cell"><div className="w-16 h-4 bg-slate-200/50 rounded-full animate-pulse ml-auto" /></td>
                                            <td className="px-6 py-5"><div className="w-16 h-4 bg-slate-200/50 rounded-full animate-pulse ml-auto" /></td>
                                            <td className="px-6 py-5"><div className="w-10 h-6 bg-slate-200/50 rounded-full animate-pulse mx-auto" /></td>
                                            <td className="px-6 py-5"><div className="w-20 h-8 bg-slate-200/50 rounded-xl animate-pulse ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : products?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-24">
                                            <div className="flex flex-col items-center gap-4 text-slate-400">
                                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
                                                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                    </svg>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-semibold text-slate-600">ยังไม่มีสินค้าในระบบ</p>
                                                    <p className="text-sm">เพิ่มสินค้าชิ้นแรกของคุณเพื่อเริ่มต้นใช้งานคลังสินค้า</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products?.map((product) => {
                                        const isLow = product.stockQuantity <= product.lowStockThreshold;
                                        const margin = product.sellPrice > 0
                                            ? Math.round(((product.sellPrice - product.costPrice) / product.sellPrice) * 100)
                                            : 0;

                                        return (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-white/60 transition-colors duration-200 group"
                                            >
                                                {/* Product */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    className="w-full h-full object-cover"
                                                                    alt={product.name}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300 text-xl">
                                                                    📦
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                                                                {product.name}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded shadow-sm font-mono">
                                                                    {product.barcode || "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-200 shadow-sm text-slate-600 rounded-lg text-xs font-semibold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-1.5"></span>
                                                        {product.category?.name || "ทั่วไป"}
                                                    </span>
                                                </td>

                                                {/* Cost */}
                                                <td className="px-6 py-4 text-right text-sm text-slate-400 tabular-nums hidden lg:table-cell font-medium">
                                                    ฿{Number(product.costPrice).toLocaleString()}
                                                </td>

                                                {/* Sell price + margin */}
                                                <td className="px-6 py-4 text-right">
                                                    <p className="text-sm font-bold text-slate-800 tabular-nums">
                                                        ฿{Number(product.sellPrice).toLocaleString()}
                                                    </p>
                                                    <p className={`text-[10px] font-semibold mt-1 ${margin >= 30 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        กำไร {margin}%
                                                    </p>
                                                </td>

                                                {/* Stock */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className="font-extrabold text-slate-800 text-sm tabular-nums">
                                                            {product.stockQuantity}
                                                        </span>
                                                        <span
                                                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shadow-sm ${isLow
                                                                    ? "bg-red-50 border-red-100 text-red-600"
                                                                    : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                                }`}
                                                        >
                                                            {isLow ? "ใกล้หมด" : "พร้อมขาย"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 sm:-translate-x-2 sm:group-hover:translate-x-0">
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            className="p-2 bg-white text-primary-600 hover:bg-primary-50 hover:border-primary-200 rounded-xl shadow-sm border border-slate-200 transition-all"
                                                            title="แก้ไข"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl shadow-sm border border-slate-200 transition-all"
                                                            title="ลบ"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
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
        </div>
    );
}