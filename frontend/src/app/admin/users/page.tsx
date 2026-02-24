"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await api.get("/users");
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const toggleRoleMutation = useMutation({
        mutationFn: async (data: { id: string; role: string }) => {
            return api.patch(`/users/${data.id}`, { role: data.role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    return (
        <>
            <div className="mb-10">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">จัดการพนักงาน</h1>
                <p className="text-sm text-slate-500 mt-1">ดูและจัดการบัญชีพนักงานในระบบ</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden border-slate-200 shadow-xl">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">รายชื่อพนักงาน</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-6 py-4">ชื่อ-นามสกุล</th>
                                <th className="px-6 py-4">อีเมล</th>
                                <th className="px-6 py-4">ตำแหน่ง</th>
                                <th className="px-6 py-4">วันที่สร้าง</th>
                                <th className="px-6 py-4 text-center">สถานะ</th>
                                <th className="px-6 py-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-20 animate-pulse text-slate-300 font-bold uppercase tracking-widest">กำลังโหลดข้อมูล...</td></tr>
                            ) : users?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 mr-3">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{user.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            user.role === 'ADMIN' 
                                                ? 'bg-purple-50 text-purple-600' 
                                                : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงานขาย'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                            ใช้งาน
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value && e.target.value !== user.role) {
                                                        toggleRoleMutation.mutate({ id: user.id, role: e.target.value });
                                                    }
                                                }}
                                                defaultValue={user.role}
                                                className="text-xs px-2 py-1 border border-slate-200 rounded"
                                            >
                                                <option value="ADMIN">ผู้ดูแล</option>
                                                <option value="CASHIER">พนักงาน</option>
                                            </select>
                                            <button 
                                                onClick={() => {
                                                    if (confirm(`ยืนยันการลบพนักงาน "${user.name}"?`)) {
                                                        deleteMutation.mutate(user.id);
                                                    }
                                                }}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            </div>
        </>
    );
}
