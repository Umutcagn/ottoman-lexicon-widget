import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeTurkishText(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replaceAll('â', 'a')
    .replaceAll('î', 'i')
    .replaceAll('û', 'u')
}

export function formatMeaning(text: string): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (!trimmed) return ''
  return trimmed.charAt(0).toLocaleUpperCase('tr-TR') + trimmed.slice(1)
}

