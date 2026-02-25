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
        <div className="h-full bg-[#F7F7F5] px-8 py-10">

            {/* ===================== HEADER ===================== */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-1">คลังสินค้า</p>
                    <h1 className="text-3xl font-semibold text-stone-800 tracking-tight">
                        จัดการสินค้า
                    </h1>
                    <p className="text-sm text-stone-400 mt-1.5">
                        เพิ่ม แก้ไข หรือลบรายการสินค้าในระบบ
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {(!categories || categories.length === 0) && (
                        <Link
                            href="/admin/categories"
                            className="px-5 py-2.5 bg-white border border-amber-300 text-amber-600 rounded-xl text-sm font-medium hover:bg-amber-50 transition-colors shadow-sm"
                        >
                            + เพิ่มหมวดหมู่ก่อน
                        </Link>
                    )}

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                        <span className="text-lg leading-none">+</span>
                        เพิ่มสินค้าใหม่
                    </button>
                </div>
            </div>

            {/* ===================== TABLE ===================== */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">

                {/* Summary bar */}
                {!isLoading && products && (
                    <div className="px-6 py-3.5 border-b border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-400">
                            ทั้งหมด{" "}
                            <span className="font-semibold text-stone-600">{products.length}</span>{" "}
                            รายการ
                        </span>
                        <span className="text-xs text-stone-400">
                            สินค้าใกล้หมด{" "}
                            <span className="font-semibold text-orange-500">
                                {products.filter(p => p.stockQuantity <= p.lowStockThreshold).length}
                            </span>{" "}
                            รายการ
                        </span>
                    </div>
                )}

                <table className="w-full text-left">
                    <thead className="bg-stone-50/60 border-b border-stone-100">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">สินค้า</th>
                            <th className="px-6 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">หมวดหมู่</th>
                            <th className="px-6 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-widest text-right">ราคาทุน</th>
                            <th className="px-6 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-widest text-right">ราคาขาย</th>
                            <th className="px-6 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-widest text-center">คงเหลือ</th>
                            <th className="px-6 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-widest text-right">จัดการ</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100">
                        {isLoading ? (
                            /* Loading skeleton */
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-stone-100 animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="w-32 h-3 bg-stone-100 rounded animate-pulse" />
                                                <div className="w-20 h-2.5 bg-stone-100 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    </td>
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <td key={j} className="px-6 py-5">
                                            <div className="w-16 h-3 bg-stone-100 rounded animate-pulse mx-auto" />
                                        </td>
                                    ))}
                                    <td className="px-6 py-5">
                                        <div className="w-20 h-3 bg-stone-100 rounded animate-pulse ml-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : products?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3 text-stone-300">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
                                            <polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line strokeLinecap="round" x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>
                                        <span className="text-sm">ยังไม่มีสินค้าในระบบ</span>
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
                                        className="hover:bg-stone-50/70 transition-colors duration-150 group"
                                    >
                                        {/* Product */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl}
                                                            className="w-full h-full object-cover"
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-lg">
                                                            📦
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-stone-800 text-sm leading-tight">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                                                        {product.barcode || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[11px] font-medium">
                                                {product.category?.name || "ทั่วไป"}
                                            </span>
                                        </td>

                                        {/* Cost */}
                                        <td className="px-6 py-4 text-right text-sm text-stone-400 tabular-nums">
                                            ฿{Number(product.costPrice).toLocaleString()}
                                        </td>

                                        {/* Sell price + margin */}
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-semibold text-stone-800 tabular-nums">
                                                ฿{Number(product.sellPrice).toLocaleString()}
                                            </p>
                                            <p className="text-[11px] text-stone-400 mt-0.5">
                                                กำไร {margin}%
                                            </p>
                                        </td>

                                        {/* Stock */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-semibold text-stone-800 text-sm tabular-nums">
                                                {product.stockQuantity}
                                            </span>
                                            <div className="mt-1.5">
                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                                        isLow
                                                            ? "bg-orange-100 text-orange-600"
                                                            : "bg-emerald-50 text-emerald-600"
                                                    }`}
                                                >
                                                    {isLow ? "ใกล้หมด" : "ปกติ"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                                                >
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    ลบ
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