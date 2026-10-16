import type { WidgetTheme } from '@/types'

export type ThemeStyleConfig = {
  container: string
  title: string
  ottoman: string
  meaning: string
  badge: string
  border: string
  label: string
}

export const themeStyles: Record<WidgetTheme, ThemeStyleConfig> = {
  midnight: {
    container: 'bg-stone-900/90 text-stone-100 backdrop-blur-md',
    title: 'text-stone-100',
    ottoman: 'text-amber-300',
    meaning: 'text-stone-300',
    badge: 'bg-stone-800 text-stone-300 border-stone-700/60',
    border: 'border-stone-700/50',
    label: 'Gece',
  },
  parchment: {
    container: 'bg-amber-50/95 text-amber-950 backdrop-blur-md shadow-sm',
    title: 'text-amber-950 font-bold',
    ottoman: 'text-amber-900',
    meaning: 'text-amber-800/90',
    badge: 'bg-amber-200/60 text-amber-900 border-amber-300/80',
    border: 'border-amber-200',
    label: 'Parşömen',
  },
  aurora: {
    container:
      'bg-gradient-to-br from-slate-900/90 via-purple-950/85 to-indigo-950/90 text-purple-100 backdrop-blur-md',
    title: 'text-white',
    ottoman: 'text-purple-300',
    meaning: 'text-purple-200/90',
    badge: 'bg-purple-900/40 text-purple-200 border-purple-700/40',
    border: 'border-purple-500/30',
    label: 'Aurora',
  },
  glass: {
    container: 'bg-white/15 dark:bg-black/40 text-white backdrop-blur-xl',
    title: 'text-white',
    ottoman: 'text-amber-200',
    meaning: 'text-white/90',
    badge: 'bg-white/20 text-white/90 border-white/30',
    border: 'border-white/25',
    label: 'Buzlu Cam',
  },
}
