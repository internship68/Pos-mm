export interface Expense {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  category: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

