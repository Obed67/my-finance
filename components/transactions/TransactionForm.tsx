'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types';
import { DEFAULT_CATEGORIES } from '@/lib/constants/categories';
import { Loader2 } from 'lucide-react';

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [type, setType] = useState<'income' | 'expense'>(
    initialData?.type || 'expense'
  );
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Montant invalide');
      }
      if (!category) {
        throw new Error('Veuillez sélectionner une catégorie');
      }
      if (!date) {
        throw new Error('Veuillez sélectionner une date');
      }

      await onSubmit({
        type,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        description,
      });
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Type de transaction</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            className={`flex-1 ${
              type === 'expense' ? 'bg-expense hover:bg-expense/90' : ''
            }`}
            onClick={() => setType('expense')}
          >
            Dépense
          </Button>
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            className={`flex-1 ${
              type === 'income' ? 'bg-income hover:bg-income/90' : ''
            }`}
            onClick={() => setType('income')}
          >
            Revenu
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="pl-8"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Input
          id="description"
          type="text"
          placeholder="Ex: Courses, Loyer..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
