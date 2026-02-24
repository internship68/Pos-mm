"use client";

import { useState } from "react";

export default function DiscountSection({
  onChange,
}: {
  onChange?: (discount: { type: "NONE" | "AMOUNT" | "PERCENT"; value: number }) => void;
}) {
  const [type, setType] = useState<"NONE" | "AMOUNT" | "PERCENT">("NONE");
  const [value, setValue] = useState<number>(0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-black text-slate-900 mb-3">ส่วนลด</div>
      <div className="grid grid-cols-3 gap-2">
        <select
          value={type}
          onChange={(e) => {
            const next = e.target.value as any;
            setType(next);
            onChange?.({ type: next, value });
          }}
          className="col-span-1 rounded-xl border border-slate-200 px-3 py-2"
        >
          <option value="NONE">ไม่มี</option>
          <option value="AMOUNT">บาท</option>
          <option value="PERCENT">%</option>
        </select>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value);
            setValue(next);
            onChange?.({ type, value: next });
          }}
          className="col-span-2 rounded-xl border border-slate-200 px-3 py-2"
          disabled={type === "NONE"}
          min={0}
        />
      </div>
    </div>
  );
}

