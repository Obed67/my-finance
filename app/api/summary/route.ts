import { NextRequest, NextResponse } from 'next/server';
import { getTransactions } from '@/lib/firebase/firestore';
import { Summary } from '@/types';

// GET /api/summary - Get financial summary for the authenticated user
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const transactions = await getTransactions(userId, filters);

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    const summary: Summary = {
      balance,
      totalIncome,
      totalExpenses,
      period: {
        start: filters.startDate || new Date(0),
        end: filters.endDate || new Date(),
      },
    };

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
