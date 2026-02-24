"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

export default function AdminExpensesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: expenses, isLoading } = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const res = await api.get("/expenses");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: { title: string; amount: number; category: string }) => {
            return api.post("/expenses", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/expenses/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">จัดการค่าใช้จ่าย</h1>
                    <p className="text-sm text-slate-500 mt-1">บันทึกค่าใช้จ่ายต่างๆ ในร้านค้า</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:scale-[1.05] transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มค่าใช้จ่าย
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden border-slate-200 shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">วันที่</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">รายการ</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">จำนวนเงิน</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">กำลังโหลดข้อมูล...</td></tr>
                        ) : expenses?.map((expense: any) => (
                            <tr key={expense.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-5 text-sm text-slate-600">
                                    {new Date(expense.createdAt).toLocaleDateString('th-TH')}
                                </td>
                                <td className="px-6 py-5">
                                    <p className="font-bold text-slate-800">{expense.title ?? expense.description}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right font-black text-red-600">-฿{Number(expense.amount).toLocaleString()}</td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => deleteMutation.mutate(expense.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="glass max-w-sm w-full rounded-3xl p-8 shadow-2xl border-white">
                        <h3 className="text-2xl font-black text-slate-800 mb-6">เพิ่มค่าใช้จ่ายใหม่</h3>
                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            const data = {
                                title: e.target.title.value,
                                amount: parseFloat(e.target.amount.value),
                                category: e.target.category.value
                            };
                            createMutation.mutate(data);
                        }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">รายการค่าใช้จ่าย</label>
                                <input name="title" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="เช่น ค่าไฟ, ค่าน้ำ, ค่าเช่า" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">จำนวนเงิน</label>
                                <input type="number" name="amount" required step="0.01" min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">หมวดหมู่</label>
                                <select name="category" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                                    <option value="">เลือกหมวดหมู่</option>
                                    <option value="ค่าไฟฟ้า">ค่าไฟฟ้า</option>
                                    <option value="ค่าน้ำ">ค่าน้ำ</option>
                                    <option value="ค่าเช่า">ค่าเช่า</option>
                                    <option value="ค่าแรง">ค่าแรง</option>
                                    <option value="วัสดุสิ้นเปลือง">วัสดุสิ้นเปลือง</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center pt-6 space-x-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase text-sm">ยกเลิก</button>
                                <button type="submit" disabled={createMutation.isPending} className="flex-1 gradient-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                                    {createMutation.isPending ? "กำลังส่งข้อมูล..." : "เพิ่มค่าใช้จ่าย"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}