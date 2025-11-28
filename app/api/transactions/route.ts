import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/firebase/firestore';

// GET /api/transactions - Get all transactions for the authenticated user
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
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filters: any = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const transactions = await getTransactions(userId, filters);

    return NextResponse.json({ transactions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, type, category, date, description } = body;

    if (!amount || !type || !category || !date) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const transactionId = await createTransaction(userId, {
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date),
      description: description || '',
      userId,
    });

    return NextResponse.json(
      { id: transactionId, message: 'Transaction créée avec succès' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
