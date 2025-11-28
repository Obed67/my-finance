'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-l-4 border-l-income shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-income" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-income">
            +{formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total des entrées ce mois
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-expense shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expense">
            -{formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total des sorties ce mois
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
