'use client'

import { Clock, Sparkles } from 'lucide-react'
import type { Word, WidgetType, WidgetTheme } from '@/types'
import { themeStyles } from '@/constants/widget-themes'
import { cn } from '@/lib/utils'

export function WidgetCard({
  word,
  type = 'medium',
  theme = 'midnight',
  intervalHours = 12,
}: {
  word: Word
  type?: WidgetType
  theme?: WidgetTheme
  intervalHours?: number
}) {
  const styles = themeStyles[theme]

  if (type === 'lock') {
    return (
      <div
        className={cn(
          'w-full rounded-2xl border p-3 shadow-lg transition-all',
          styles.container,
          styles.border,
        )}
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            Ottoman Dict
          </span>
          <span className="ottoman font-serif text-base leading-none text-amber-300">
            {word.ottoman}
          </span>
        </div>
        <p className={cn('font-serif text-base font-bold leading-tight', styles.title)}>
          {word.tr}
        </p>
        <p className={cn('mt-0.5 line-clamp-2 text-[11px] leading-snug', styles.meaning)}>
          {word.meaning}
        </p>
      </div>
    )
  }

  if (type === 'small') {
    return (
      <div
        className={cn(
          'flex aspect-square w-full flex-col justify-between rounded-3xl border p-3.5 shadow-md transition-all',
          styles.container,
          styles.border,
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-semibold', styles.badge)}
          >
            Sözlük
          </span>
          <Sparkles className="size-3.5 opacity-60" />
        </div>

        <div className="my-auto text-center">
          <p className={cn('ottoman font-serif text-2xl leading-none', styles.ottoman)}>
            {word.ottoman}
          </p>
          <p className={cn('mt-1 font-serif text-base font-bold leading-tight', styles.title)}>
            {word.tr}
          </p>
          <p className={cn('mt-1 line-clamp-2 text-[10px] leading-tight', styles.meaning)}>
            {word.meaning}
          </p>
        </div>

        <div className="flex items-center justify-between text-[9px] opacity-60">
          <span>{intervalHours}s yenilenir</span>
          <Clock className="size-3" />
        </div>
      </div>
    )
  }

  if (type === 'large') {
    return (
      <div
        className={cn(
          'flex w-full flex-col gap-2.5 rounded-3xl border p-4 shadow-lg transition-all',
          styles.container,
          styles.border,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[10px] font-semibold',
                styles.badge,
              )}
            >
              Ottoman Dict
            </span>
            <span className="text-[10px] opacity-75">{word.usageSource}</span>
          </div>
          <span className="text-[10px] opacity-60">{intervalHours}saatlik kelime</span>
        </div>

        <div className="flex items-center justify-between border-b border-current/10 pb-2">
          <div>
            <h4 className={cn('font-serif text-xl font-bold leading-tight', styles.title)}>
              {word.tr}
            </h4>
            <p className={cn('text-xs opacity-80 font-serif italic', styles.meaning)}>
              {word.tags.join(' · ')}
            </p>
          </div>
          <p className={cn('ottoman font-serif text-3xl leading-none', styles.ottoman)}>
            {word.ottoman}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Anlamı</p>
          <p className={cn('mt-0.5 text-xs leading-relaxed line-clamp-2', styles.meaning)}>
            {word.meaning}
          </p>
        </div>

        {word.example && (
          <div className="rounded-xl bg-black/10 dark:bg-white/5 p-2 border border-current/10">
            <p className="text-[10px] italic line-clamp-2 opacity-90 font-serif">
              “{word.example}”
            </p>
          </div>
        )}
      </div>
    )
  }

  // Medium (4x2) varsayılan
  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between rounded-3xl border p-3.5 shadow-md transition-all',
        styles.container,
        styles.border,
      )}
    >
      <div className="flex items-center justify-between border-b border-current/10 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-semibold', styles.badge)}
          >
            Günün Kelimesi
          </span>
          <span className="text-[10px] opacity-60">{word.usageSource}</span>
        </div>
        <span className={cn('ottoman font-serif text-xl leading-none', styles.ottoman)}>
          {word.ottoman}
        </span>
      </div>

      <div className="my-1.5">
        <h4 className={cn('font-serif text-lg font-bold leading-tight', styles.title)}>
          {word.tr}
        </h4>
        <p className={cn('mt-0.5 line-clamp-2 text-xs leading-relaxed', styles.meaning)}>
          {word.meaning}
        </p>
      </div>

      <div className="flex items-center justify-between text-[9px] opacity-60 pt-1 border-t border-current/10">
        <span>Her {intervalHours} saatte otomatik yenilenir</span>
        <Clock className="size-3" />
      </div>
    </div>
  )
}
