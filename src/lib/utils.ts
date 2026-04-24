import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0,
  }).format(amount) + ' RWF';
}

export function formatDate(date: string | Date, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'rw' ? 'en-US' : locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getLocalizedField(
  obj: any,
  field: string,
  language: string = 'en'
): string {
  if (!obj) return '';
  const suffix = language === 'rw' ? 'Rw' : language === 'fr' ? 'Fr' : '';
  const key = suffix ? `${field}${suffix}` : field;
  return obj[key] || obj[field] || '';
}

export function truncate(str: string, length: number = 50): string {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
