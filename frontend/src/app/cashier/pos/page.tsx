"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Product } from "@/types/product.type";
import { saleService } from "@/services/sale.service";
import { PaymentMethod } from "@/types/sale.type";

interface CartItem extends Product {
    quantity: number;
}

export default function POSPage() {
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

    // Create sale mutation
    const createSaleMutation = useMutation({
        mutationFn: async (data: { items: CartItem[], paymentMethod: PaymentMethod }) => {
            const saleData = {
                items: data.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    priceAtSale: item.sellPrice
                })),
                paymentMethod: data.paymentMethod
            };
            return saleService.create(saleData);
        },
        onSuccess: () => {
            setCart([]);
            setIsPaymentModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["products-active"] });
            alert("การขายสำเร็จ!");
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการขาย");
        }
    });

    // Filter products based on search
    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.barcode?.includes(search)
    ) || [];

    // Cart operations
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.id !== productId));
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.sellPrice * item.quantity), 0);
    };

    const handleSale = () => {
        if (cart.length === 0) {
            alert("กรุณาเพิ่มสินค้าในตะกร้า");
            return;
        }
        setIsPaymentModalOpen(true);
    };

    const confirmSale = () => {
        createSaleMutation.mutate({
            items: cart,
            paymentMethod
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้าหรือสแกนบาร์โค้ด..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                                <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded" />
                                    ) : (
                                        <span className="text-gray-400">No Image</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                                <p className="text-lg font-bold text-blue-600">฿{product.sellPrice}</p>
                                <p className="text-xs text-gray-500">สต็อก: {product.stockQuantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-4">ตะกร้าสินค้า</h2>
                    
                    <div className="max-h-64 overflow-y-auto mb-4">
                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">ตะกร้าว่าง</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between mb-2 pb-2 border-b">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{item.name}</h4>
                                        <p className="text-sm text-gray-500">฿{item.sellPrice} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6 h-6 bg-gray-200 rounded text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-6 h-6 bg-gray-200 rounded text-sm"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 text-sm"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between mb-4">
                            <span className="font-semibold">ยอดรวม:</span>
                            <span className="text-xl font-bold text-blue-600">฿{calculateTotal()}</span>
                        </div>
                        <button
                            onClick={handleSale}
                            disabled={cart.length === 0}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
                        >
                            ชำระเงิน
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">ชำระเงิน</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">ยอดรวม:</p>
                            <p className="text-2xl font-bold text-blue-600">฿{calculateTotal()}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">วิธีการชำระ:</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="CASH">เงินสด</option>
                                <option value="TRANSFER">โอนเงิน</option>
                                <option value="QR">QR Code</option>
                            </select>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={confirmSale}
                                disabled={createSaleMutation.isPending}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                {createSaleMutation.isPending ? "กำลังชำระ..." : "ยืนยัน"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}