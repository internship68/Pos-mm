import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 border-slate-200 ${error ? "border-red-300 focus:ring-red-200" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  ),
);
Input.displayName = "Input";

