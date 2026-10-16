'use client'

import type { Word, WidgetType, WidgetTheme } from '@/types'
import { useClock } from '@/hooks/use-clock'
import { WidgetCard } from './widget-card'

export function HomeScreenPreview({
  word,
  type = 'medium',
  theme = 'midnight',
  intervalHours = 12,
}: {
  word: Word
  type: WidgetType
  theme: WidgetTheme
  intervalHours: number
}) {
  const now = useClock()
  const time = now
    ? now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '14:30'

  return (
    <div className="relative mx-auto aspect-[9/18] w-full max-w-[260px] overflow-hidden rounded-[2.5rem] border-[7px] border-slate-900 bg-slate-950 text-white shadow-2xl">
      {/* Duvar kağıdı */}
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 via-amber-950/40 to-slate-900" />

      {/* Çentik */}
      <div className="absolute left-1/2 top-2.5 h-4 w-20 -translate-x-1/2 rounded-full bg-black/80 shadow-sm" />

      <div className="relative flex h-full flex-col px-4 pb-4 pt-9">
        <div className="flex items-center justify-between text-[10px] font-medium opacity-80">
          <span>{time}</span>
          <div className="flex items-center gap-1">
            <span>%95</span>
          </div>
        </div>

        {/* Ana Ekran Uygulama İkonları & Widget Grid */}
        <div className="mt-6 flex flex-col gap-3">
          <WidgetCard word={word} type={type} theme={theme} intervalHours={intervalHours} />

          {/* Sahte Uygulama İkonları Grid */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {['Sözlük', 'Kitaplar', 'Notlar', 'Ayarlar', 'Tarih', 'Kütüphane', 'Ses', 'Harita'].map(
              (name, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="size-10 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-[10px] font-bold">
                    {name[0]}
                  </div>
                  <span className="text-[9px] text-white/70">{name}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
