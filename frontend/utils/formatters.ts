export function formatCurrency(amount: number, currency = 'ETB'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString();
}

export function initials(fullName: string): string {
  return fullName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}