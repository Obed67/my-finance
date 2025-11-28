import { Category } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  {
    id: 'salary',
    name: 'Salaire',
    type: 'income',
    color: '#10b981',
    icon: '💼',
    isDefault: true,
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    color: '#3b82f6',
    icon: '💻',
    isDefault: true,
  },
  {
    id: 'investment',
    name: 'Investissement',
    type: 'income',
    color: '#8b5cf6',
    icon: '📈',
    isDefault: true,
  },
  {
    id: 'other-income',
    name: 'Autre revenu',
    type: 'income',
    color: '#06b6d4',
    icon: '💰',
    isDefault: true,
  },
  
  // Expense categories
  {
    id: 'food',
    name: 'Alimentation',
    type: 'expense',
    color: '#ef4444',
    icon: '🍔',
    isDefault: true,
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    color: '#f59e0b',
    icon: '🚗',
    isDefault: true,
  },
  {
    id: 'housing',
    name: 'Logement',
    type: 'expense',
    color: '#ec4899',
    icon: '🏠',
    isDefault: true,
  },
  {
    id: 'utilities',
    name: 'Factures',
    type: 'expense',
    color: '#6366f1',
    icon: '⚡',
    isDefault: true,
  },
  {
    id: 'entertainment',
    name: 'Loisirs',
    type: 'expense',
    color: '#14b8a6',
    icon: '🎮',
    isDefault: true,
  },
  {
    id: 'health',
    name: 'Santé',
    type: 'expense',
    color: '#f43f5e',
    icon: '🏥',
    isDefault: true,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    color: '#a855f7',
    icon: '🛍️',
    isDefault: true,
  },
  {
    id: 'education',
    name: 'Éducation',
    type: 'expense',
    color: '#0ea5e9',
    icon: '📚',
    isDefault: true,
  },
  {
    id: 'other-expense',
    name: 'Autre dépense',
    type: 'expense',
    color: '#64748b',
    icon: '📝',
    isDefault: true,
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return DEFAULT_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
  return DEFAULT_CATEGORIES.filter(cat => cat.type === type || cat.type === 'both');
};
