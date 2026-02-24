"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
}

export function Modal({ open, title, onClose, className = "", children }: ModalProps) {
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: "rgba(20, 18, 16, 0.5)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={(e) => e.target === backdropRef.current && onClose()}
        >
            <div
                className={`relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden ${className}`}
                style={{ animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1)" }}
            >
                {/* Top accent line */}
                <div className="h-px w-full bg-gradient-to-r from-[#6B7CFF] via-[#9BA7FF] to-transparent" />

                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-stone-100">
                    <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-1 font-medium">
                            สินค้า
                        </p>
                        <h2 className="text-lg font-semibold text-stone-800 tracking-tight">
                            {title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-0.5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                        aria-label="ปิด"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-7 py-6 max-h-[78vh] overflow-y-auto">
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </div>,
        document.body
    );
}