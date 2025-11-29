'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { CategorySummary } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CategoryChartProps {
  categories: CategorySummary[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  const { currency } = useCurrency();
  
  if (categories.length === 0) {
    return (
      <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium">Pas de données</h3>
        <p className="text-muted-foreground">
          Ajoutez des dépenses pour voir la répartition
        </p>
      </Card>
    );
  }

  const chartData = categories.map((cat) => ({
    name: cat.category,
    amount: cat.amount,
    color: cat.color,
  }));

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Répartition des Dépenses</CardTitle>
        <CardDescription>Par catégorie pour la période actuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value, currency)}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
