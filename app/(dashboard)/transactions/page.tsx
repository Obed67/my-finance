'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { Transaction } from '@/types';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Transaction
        </Button>
      </div>

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

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={openEditModal}
          onDelete={handleDeleteTransaction}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
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
