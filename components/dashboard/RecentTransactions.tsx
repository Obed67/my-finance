'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { formatCurrency, formatRelativeDate } from '@/lib/utils/formatters';
import { getCategoryById } from '@/lib/constants/categories';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  const router = useRouter();
  const { currency } = useCurrency();


  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transactions Récentes</CardTitle>
          <CardDescription>Vos 5 dernières opérations</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => router.push('/transactions')}
        >
          Voir tout <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune transaction récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const category = getCategoryById(transaction.category);
              const isIncome = transaction.type === 'income';

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl p-2 bg-muted rounded-full">
                      {category?.icon || '📝'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.description || category?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      isIncome ? 'text-income' : 'text-expense'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
