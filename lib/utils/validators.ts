export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && !isNaN(amount) && isFinite(amount);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
