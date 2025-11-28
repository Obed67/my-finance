import { NextRequest, NextResponse } from 'next/server';
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '@/lib/firebase/firestore';

// PUT /api/transactions/[id] - Update a transaction
// PUT /api/transactions/[id] - Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verify the transaction belongs to the user
    const transaction = await getTransactionById(id);
    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    const updates: any = {};
    if (body.amount !== undefined) updates.amount = parseFloat(body.amount);
    if (body.type) updates.type = body.type;
    if (body.category) updates.category = body.category;
    if (body.date) updates.date = new Date(body.date);
    if (body.description !== undefined) updates.description = body.description;

    await updateTransaction(id, updates);

    return NextResponse.json({ message: 'Transaction mise à jour avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify the transaction belongs to the user
    const transaction = await getTransactionById(id);
    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      );
    }

    await deleteTransaction(id);

    return NextResponse.json({ message: 'Transaction supprimée avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
