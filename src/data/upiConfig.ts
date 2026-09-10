export const DEFAULT_UPI_ID = (import.meta.env.VITE_UPI_ID as string) || 'chaikatta@upi';
export const DEFAULT_PAYEE_NAME = 'CHAI KATTA';

/**
 * Builds standard NPCI UPI payment URL
 * Spec: upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tn={note}
 */
export function generateUpiUrl(amount: number, note = 'Chai Katta Bill', upiId = DEFAULT_UPI_ID): string {
  const cleanAmount = Number(amount).toFixed(2);
  const params = new URLSearchParams({
    pa: upiId,
    pn: DEFAULT_PAYEE_NAME,
    am: cleanAmount,
    cu: 'INR',
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
}
