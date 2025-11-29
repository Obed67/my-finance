'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { getCategoryById } from '@/lib/constants/categories';
import { Pencil, Trash2, Inbox } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const { currency } = useCurrency();
  
  if (transactions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Inbox className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Aucune transaction trouvée</p>
          <p className="text-sm mt-2">Commencez par ajouter votre première transaction</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const category = getCategoryById(transaction.category);
        const isIncome = transaction.type === 'income';

        return (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-3xl p-2 bg-muted rounded-full">
                  {category?.icon || '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold truncate">
                      {transaction.description || category?.name || 'Transaction'}
                    </h4>
                    <span
                      className="px-2 py-0.5 text-xs rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: `${category?.color}20`,
                        color: category?.color,
                      }}
                    >
                      {category?.name || transaction.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p
                    className={`text-lg font-bold ${
                      isIncome ? 'text-income' : 'text-expense'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isIncome ? 'Revenu' : 'Dépense'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TransactionList;
