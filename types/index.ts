export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon: string;
  isDefault: boolean;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface Summary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  type?: 'income' | 'expense';
}
