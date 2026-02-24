"use client";

import CashierLayout from "@/components/layout/CashierLayout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Product } from "@/types/product.type";
import { saleService } from "@/services/sale.service";
import { PaymentMethod } from "@/types/sale.type";

interface CartItem extends Product {
    quantity: number;
}

export default function CashierPage() {
    const queryClient = useQueryClient();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState("");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

    // Fetch products for listing
    const { data: products } = useQuery<Product[]>({
        queryKey: ["products-active"],
        queryFn: async () => {
            const res = await api.get("/products");
            return res.data;
        },
    });

    const checkoutMutation = useMutation({
        mutationFn: saleService.create,
        onSuccess: () => {
            setCart([]);
            setIsPaymentModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["products-active"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            alert("ชำระเงินสำเร็จ!");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการชำระเงิน");
        }
    });

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode?.includes(search)
    ) || [];

    const addToCart = (product: Product) => {
        if (product.stockQuantity <= 0) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stockQuantity) return prev;
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return item;
                if (newQty > item.stockQuantity) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const total = cart.reduce((sum, item) => sum + (Number(item.sellPrice) * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        checkoutMutation.mutate({
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            paymentMethod: paymentMethod
        });
    };

    return (
        <CashierLayout>
            <div className="flex h-full relative">
                {/* Product Selection Area */}
                <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200">
                    <div className="p-6">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="สแกนบาร์โค้ด หรือ ค้นหาชื่อสินค้า..."
                                className="w-full bg-white border border-slate-200 py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    disabled={product.stockQuantity <= 0}
                                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex flex-col h-full group disabled:opacity-50 disabled:scale-100"
                                >
                                    <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-3 mb-4 flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 line-clamp-2 text-sm leading-tight mb-1">{product.name}</p>
                                        <p className="text-primary-600 font-extrabold text-lg">฿{Number(product.sellPrice).toLocaleString()}</p>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center text-[10px] font-bold">
                                        <span className={`px-2 py-0.5 rounded-full ${product.stockQuantity > 5 ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-600'}`}>
                                            คงเหลือ: {product.stockQuantity}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Area */}
                <div className="w-[400px] flex flex-col bg-white shadow-2xl z-20">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900 leading-none">ตะกร้าสินค้า</h3>
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-xs font-black">
                            {cart.reduce((s, i) => s + i.quantity, 0)} รายการ
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p className="font-bold uppercase tracking-widest text-sm">ยังไม่มีสินค้า</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex space-x-4 p-2 group">
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden">
                                        {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : null}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-primary-600 text-sm font-bold">฿{Number(item.sellPrice).toLocaleString()}</p>
                                            <span className="text-slate-300 text-xs">x {item.quantity}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 mt-2">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">-</button>
                                            <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">ยอดรวมทั้งสิ้น</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">฿{total.toLocaleString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCart([])}
                                disabled={cart.length === 0}
                                className="py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition-all disabled:opacity-50"
                            >
                                ล้างตะกร้า
                            </button>
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                disabled={cart.length === 0}
                                className="py-4 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                ชำระเงิน
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Modal */}
                {isPaymentModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="glass max-w-md w-full rounded-3xl p-8 shadow-2xl border-white animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
                                <svg className="w-8 h-8 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                เลือกวิธีการชำระเงิน
                            </h3>

                            <div className="space-y-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod("CASH")}
                                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${paymentMethod === "CASH" ? "border-primary-500 bg-primary-50" : "border-slate-100 hover:border-slate-300"}`}
                                >
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-xl mr-4 ${paymentMethod === "CASH" ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-slate-800">เงินสด (CASH)</p>
                                            <p className="text-xs text-slate-500">จ่ายด้วยเงินสดหน้าเคาน์เตอร์</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "CASH" && <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("TRANSFER")}
                                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${paymentMethod === "TRANSFER" ? "border-primary-500 bg-primary-50" : "border-slate-100 hover:border-slate-300"}`}
                                >
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-xl mr-4 ${paymentMethod === "TRANSFER" ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-slate-800">โอนเงิน (TRANSFER)</p>
                                            <p className="text-xs text-slate-500">สแกน QR Code เพื่อโอนเงิน</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "TRANSFER" && <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                                </button>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                                <span className="font-bold text-slate-500 text-sm">ยอดชำระทั้งสิ้น</span>
                                <span className="text-3xl font-black text-primary-600">฿{total.toLocaleString()}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutMutation.isPending}
                                    className="py-4 gradient-primary text-white rounded-2xl font-extrabold shadow-lg shadow-primary-200 hover:scale-[1.05] transition-all disabled:opacity-50"
                                >
                                    {checkoutMutation.isPending ? "กำลังบันทึก..." : "ยืนยันชำระเงิน"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CashierLayout>
    );
}
