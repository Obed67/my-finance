import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Transaction, TransactionFilters } from '@/types';

const TRANSACTIONS_COLLECTION = 'transactions';

// Create a new transaction
export const createTransaction = async (
  userId: string,
  transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transactionData,
      userId,
      date: Timestamp.fromDate(transactionData.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la création de la transaction');
  }
};

// Get all transactions for a user
export const getTransactions = async (
  userId: string,
  filters?: TransactionFilters
): Promise<Transaction[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('date', 'desc'),
    ];

    // Apply filters
    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters?.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(filters.startDate)));
    }
    if (filters?.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(filters.endDate)));
    }

    const q = query(collection(db, TRANSACTIONS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);

    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        description: data.description,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
      });
    });

    return transactions;
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.message || 'Erreur lors de la récupération des transactions');
  }
};

// Get a single transaction by ID
export const getTransactionById = async (
  transactionId: string
): Promise<Transaction | null> => {
  try {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        description: data.description,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
      };
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    throw new Error(error.message || 'Erreur lors de la récupération de la transaction');
  }
};

// Update a transaction
export const updateTransaction = async (
  transactionId: string,
  updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }

    await updateDoc(docRef, updateData);
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la mise à jour de la transaction');
  }
};

// Delete a transaction
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    await deleteDoc(docRef);
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la suppression de la transaction');
  }
};
