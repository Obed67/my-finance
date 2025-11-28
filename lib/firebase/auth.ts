import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de l\'inscription');
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la connexion');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la connexion avec Google');
  }
};

// Sign out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de la déconnexion');
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
