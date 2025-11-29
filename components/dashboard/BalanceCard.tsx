'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatters';
import { useCurrency } from '@/contexts/CurrencyContext';


interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const isPositive = balance >= 0;
  const { currency } = useCurrency();

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-primary-foreground/80">
          Solde Total
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <h2 className="text-4xl font-bold tracking-tight">
            {formatCurrency(balance, currency)}
          </h2>
          <span className="text-3xl filter drop-shadow-md">
            {isPositive ? '🤑' : '💸'}
          </span>
        </div>
        <p className="text-sm mt-2 text-primary-foreground/80">
          {isPositive
            ? 'Vos finances sont en bonne santé !'
            : 'Attention à vos dépenses ce mois-ci.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
