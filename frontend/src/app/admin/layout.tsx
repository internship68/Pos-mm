"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user && user.role !== "ADMIN") {
      router.replace("/cashier");
    }
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated || (user && user.role !== "ADMIN")) {
    return null;
  }

  const menuItems = [
    { name: "แดชบอร์ด", href: "/admin", icon: DashboardIcon },
    { name: "สินค้า", href: "/admin/products", icon: ProductsIcon },
    { name: "หมวดหมู่", href: "/admin/categories", icon: CategoriesIcon },
    { name: "จัดการสต็อก", href: "/admin/inventory", icon: InventoryIcon },
    { name: "รายงาน", href: "/admin/reports", icon: ReportsIcon },
    { name: "รายจ่าย", href: "/admin/expenses", icon: ExpensesIcon },
    { name: "พนักงาน", href: "/admin/users", icon: UsersIcon },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 hidden md:flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-slate-300 shadow-2xl">
        
        <div className="p-8">
          <h1 className="text-2xl font-black text-white tracking-wide">
            POS<span className="text-indigo-400"> ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-r-full" />
                )}

                <item.icon
                  className={`w-5 h-5 ${
                    active ? "text-indigo-400" : "text-slate-400"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              const { logout } = useAuthStore.getState();
              logout();
              router.replace("/login");
            }}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogoutIcon className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 overflow-y-auto">

        {/* HEADER */}
        <header className="flex justify-between items-center px-10 py-6 backdrop-blur bg-white/70 border-b border-slate-200 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              สวัสดี,{" "}
              <span className="text-indigo-600 font-black">
                {user?.name}
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              ภาพรวมธุรกิจของคุณวันนี้
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="text-sm leading-tight">
                <p className="font-semibold text-slate-800">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function DashboardIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function ProductsIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}

function CategoriesIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}

function InventoryIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}

function ReportsIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function ExpensesIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15"
      />
    </svg>
  );
}

function UsersIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function LogoutIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}