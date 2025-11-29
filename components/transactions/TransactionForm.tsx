'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types';
import { DEFAULT_CATEGORIES } from '@/lib/constants/categories';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency, CURRENCY_INFO } from '@/contexts/CurrencyContext';

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
  const { currency } = useCurrency();
  const currencySymbol = CURRENCY_INFO[currency].symbol;
  
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

  const filteredCategories = DEFAULT_CATEGORIES.filter((cat) => cat.type === type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {/* Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Type de transaction</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            className={`h-14 text-base font-medium transition-all ${
              type === 'expense' 
                ? 'bg-expense hover:bg-expense/90 text-white' 
                : 'hover:bg-expense/10 hover:text-expense hover:border-expense'
            }`}
            onClick={() => setType('expense')}
          >
            <TrendingDown className="mr-2 h-5 w-5" />
            Dépense
          </Button>
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            className={`h-14 text-base font-medium transition-all ${
              type === 'income' 
                ? 'bg-income hover:bg-income/90 text-white' 
                : 'hover:bg-income/10 hover:text-income hover:border-income'
            }`}
            onClick={() => setType('income')}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Revenu
          </Button>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-3">
        <Label htmlFor="amount" className="text-base font-semibold">
          Montant <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold text-lg">
            {currencySymbol}
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className={`h-14 text-lg font-medium ${currency === 'XAF' ? 'pl-20' : 'pl-12'}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <Label htmlFor="category" className="text-base font-semibold">
          Catégorie <span className="text-destructive">*</span>
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="h-14 text-base">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="text-base py-3">
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div className="space-y-3">
        <Label htmlFor="date" className="text-base font-semibold">
          Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="date"
          type="date"
          className="h-14 text-base"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-base font-semibold">
          Description <span className="text-muted-foreground text-sm font-normal">(optionnel)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Ex: Courses du mois, Loyer, Salaire..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] text-base resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 text-base"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-12 text-base font-semibold" 
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
