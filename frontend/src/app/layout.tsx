import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const outfit = Outfit({
    subsets: ["latin", "thai"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "POS & Store Management | ระบบจัดการร้านค้าอัจฉริยะ",
    description: "ระบบ POS ครบวงจรสำหรับร้านค้าปลีก จัดการคลังสินค้า พนักงาน และรายงานยอดขายอย่างมืออาชีพ",
    keywords: "POS, Store Management, ระบบขายหน้าร้าน, จัดการสต็อก, ระบบบัญชีร้านค้า",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body className={`${outfit.variable} font-sans antialiased bg-slate-50`}>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}
