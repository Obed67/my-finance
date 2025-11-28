import { NextRequest, NextResponse } from 'next/server';
import { getTransactions } from '@/lib/firebase/firestore';
import { CategorySummary } from '@/types';
import { getCategoryById } from '@/lib/constants/categories';

// GET /api/summary/by-category - Get summary grouped by category
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'income' | 'expense' | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filters: any = {};
    if (type) filters.type = type;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const transactions = await getTransactions(userId, filters);

    // Group by category
    const categoryMap = new Map<string, number>();
    let total = 0;

    transactions.forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.amount);
      total += transaction.amount;
    });

    // Convert to array with percentages
    const categorySummaries: CategorySummary[] = [];
    categoryMap.forEach((amount, categoryId) => {
      const category = getCategoryById(categoryId);
      categorySummaries.push({
        category: category?.name || categoryId,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: category?.color || '#64748b',
      });
    });

    // Sort by amount descending
    categorySummaries.sort((a, b) => b.amount - a.amount);

    return NextResponse.json({ categories: categorySummaries, total });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
