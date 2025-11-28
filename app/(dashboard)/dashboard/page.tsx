'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BalanceCard from '@/components/dashboard/BalanceCard';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryChart from '@/components/dashboard/CategoryChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { Loader2 } from 'lucide-react';
import { Transaction, CategorySummary, Summary } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch summary
      const summaryRes = await fetch('/api/summary', {
        headers: { 'x-user-id': user!.uid },
      });
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary);

      // Fetch category breakdown (expenses only)
      const categoriesRes = await fetch('/api/summary/by-category?type=expense', {
        headers: { 'x-user-id': user!.uid },
      });
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.categories || []);

      // Fetch recent transactions
      const transactionsRes = await fetch('/api/transactions', {
        headers: { 'x-user-id': user!.uid },
      });
      const transactionsData = await transactionsRes.json();
      setRecentTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Balance Card */}
      <BalanceCard balance={summary?.balance || 0} />

      {/* Summary Cards */}
      <SummaryCards
        totalIncome={summary?.totalIncome || 0}
        totalExpenses={summary?.totalExpenses || 0}
      />

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categories={categories} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
