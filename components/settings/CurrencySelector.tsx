'use client';

import React from 'react';
import { useCurrency, Currency, CURRENCY_INFO } from '@/contexts/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sélectionner une devise" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CURRENCY_INFO).map(([code, info]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{info.symbol}</span>
              <span>{info.name}</span>
              <span className="text-muted-foreground text-xs">({code})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
