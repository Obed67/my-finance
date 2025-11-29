'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Search, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction } from '@/types';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatters';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, typeFilter, categoryFilter, startDate, endDate]);

  useEffect(() => {
    // Filter transactions based on search query
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      if (categoryFilter !== 'all') queryParams.append('category', categoryFilter);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const res = await fetch(`/api/transactions?${queryParams.toString()}`, {
        headers: { 'x-user-id': user!.uid },
      });
      const data = await res.json();
      setTransactions(data.transactions || []);
      setFilteredTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.uid,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');

      toast.success('Transaction ajoutée avec succès');
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error("Erreur lors de l'ajout de la transaction");
    }
  };

  const handleUpdateTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;

    try {
      const res = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.uid,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Erreur lors de la modification');

      toast.success('Transaction modifiée avec succès');
      setIsModalOpen(false);
      setEditingTransaction(undefined);
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error("Erreur lors de la modification de la transaction");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user!.uid },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      toast.success('Transaction supprimée avec succès');
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error("Erreur lors de la suppression de la transaction");
    }
  };

  const openCreateModal = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  // Calculate statistics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-income">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-income" />
              Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              +{formatCurrency(totalIncome, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.filter((t) => t.type === 'income').length} transaction(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-expense">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-expense" />
              Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              -{formatCurrency(totalExpenses, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.filter((t) => t.type === 'expense').length} transaction(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Solde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatCurrency(balance, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.length} transaction(s) au total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une transaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateModal} size="lg" className="w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" /> Nouvelle Transaction
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters
        type={typeFilter}
        category={categoryFilter}
        startDate={startDate}
        endDate={endDate}
        onTypeChange={setTypeFilter}
        onCategoryChange={setCategoryFilter}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
      />

      {/* Transactions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Chargement des transactions...</p>
        </div>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onEdit={openEditModal}
          onDelete={handleDeleteTransaction}
        />
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les détails ci-dessous pour {editingTransaction ? 'modifier' : 'créer'} une transaction.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            initialData={editingTransaction}
            onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
