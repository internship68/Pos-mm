import * as React from "react";

export function Spinner({ className = "", size = 16 }: { className?: string; size?: number }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 ${className}`}
      style={{ width: size, height: size }}
      aria-label="loading"
    />
  );
}

