'use client'

import type { Word, WidgetTheme } from '@/types'
import { useClock } from '@/hooks/use-clock'
import { WidgetCard } from './widget-card'

export function LockScreenPreview({
  word,
  theme = 'glass',
}: {
  word: Word
  theme?: WidgetTheme
}) {
  const now = useClock()
  const time = now
    ? now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '14:30'
  const date = now
    ? now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short' })
    : '8 Ağu Cmt'

  return (
    <div className="relative mx-auto aspect-[9/18] w-full max-w-[260px] overflow-hidden rounded-[2.5rem] border-[7px] border-slate-900 bg-gradient-to-b from-slate-900 via-stone-900 to-amber-950 text-white shadow-2xl">
      {/* Duvar kağıdı deseni */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(217,119,6,0.18),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.15),transparent_50%)]" />

      {/* iPhone Çentik/Ada */}
      <div className="absolute left-1/2 top-2.5 h-4 w-20 -translate-x-1/2 rounded-full bg-black/80 shadow-sm" />

      <div className="relative flex h-full flex-col px-4 pb-5 pt-9">
        <div className="flex items-center justify-between text-[10px] font-medium opacity-80">
          <span>Türk Telekom</span>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>%95</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs font-semibold text-amber-200/90 tracking-wide">{date}</p>
          <p className="text-5xl font-bold tracking-tight text-white drop-shadow-md">{time}</p>
        </div>

        {/* Lock Screen Widget alanı */}
        <div className="mt-auto">
          <WidgetCard word={word} type="lock" theme={theme} />
        </div>
      </div>
    </div>
  )
}
