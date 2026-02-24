import { create } from "zustand";

type ReportUiState = {
  startDate: string | null;
  endDate: string | null;
  setRange: (range: { startDate: string | null; endDate: string | null }) => void;
  clear: () => void;
};

export const useReportStore = create<ReportUiState>((set) => ({
  startDate: null,
  endDate: null,
  setRange: (range) => set({ startDate: range.startDate, endDate: range.endDate }),
  clear: () => set({ startDate: null, endDate: null }),
}));

