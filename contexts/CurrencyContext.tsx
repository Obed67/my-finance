'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'XAF'; // XAF = FCFA

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EUR');

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency;
    if (savedCurrency && ['EUR', 'USD', 'GBP', 'XAF'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export const CURRENCY_INFO: Record<Currency, { symbol: string; name: string; locale: string }> = {
  EUR: { symbol: '€', name: 'Euro', locale: 'fr-FR' },
  USD: { symbol: '$', name: 'Dollar US', locale: 'en-US' },
  GBP: { symbol: '£', name: 'Livre Sterling', locale: 'en-GB' },
  XAF: { symbol: 'FCFA', name: 'Franc CFA', locale: 'fr-FR' },
};
