'use client'

import { useMemo, useState } from 'react'
import { Clock3, Compass, Dice5, Search, Sparkles, Tag, X } from 'lucide-react'
import type { Word } from '@/types'
import { words } from '@/lib/words'
import { useApp } from '@/lib/app-store'
import { normalizeTurkishText } from '@/lib/utils'
import { WordDetailModal } from '@/components/modals/word-detail-modal'
import { WidgetStudioModal } from '@/components/widget'
import { InstagramStoryModal } from '@/components/modals/instagram-story-modal'

const trendTags = [
  'Edebiyat',
  'Tasavvuf',
  'Felsefe',
  'Şiir',
  'Aşk',
  'Sanat',
  'Dua',
  'Düşünce',
  'Hüzün',
  'Zaman',
]

export function SearchScreen() {
  const { state, addRecent } = useApp()
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState<Word | null>(null)
  const [widgetWord, setWidgetWord] = useState<Word | null>(null)
  const [storyWord, setStoryWord] = useState<Word | null>(null)

  const results = useMemo(() => {
    const nq = normalizeTurkishText(q.trim())
    if (!nq) return []
    return words.filter(
      (w) =>
        normalizeTurkishText(w.tr).includes(nq) ||
        normalizeTurkishText(w.meaning).includes(nq) ||
        w.ottoman.includes(q.trim()) ||
        w.tags.some((t) => normalizeTurkishText(t).includes(nq)),
    )
  }, [q])

  // Featured 4 curated words
  const featuredWords = useMemo(() => {
    return [words[0], words[1], words[2], words[4]].filter(Boolean)
  }, [])

  function openWord(w: Word) {
    addRecent(w.tr)
    setDetail(w)
  }

  function pickRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    const randomW = words[randomIndex]
    openWord(randomW)
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-5">
      <div>
        <h1 className="mb-1 font-serif text-2xl font-bold">Keşfet & Ara</h1>
        <p className="text-sm text-muted-foreground">Binlerce yıllık Osmanlıca zenginliği keşfet</p>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kelime, anlam veya etiket ara — ör. vuslat, tasavvuf…"
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-10 text-sm outline-none ring-primary/30 transition focus:ring-2 shadow-sm"
          autoComplete="off"
          spellCheck={false}
        />
        {q && (
          <button
            onClick={() => setQ('')}
            aria-label="Temizle"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4.5" />
          </button>
        )}
      </div>

      {/* Arama Sonuçları */}
      {q.trim() ? (
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Aradığınız kriterlere uygun kelime bulunamadı.
            </p>
          )}
          {results.map((w) => (
            <button
              key={w.id}
              onClick={() => openWord(w)}
              className="flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/40"
            >
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-semibold">{w.tr}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">{w.meaning}</span>
              </span>
              <span className="ottoman font-serif text-2xl text-primary">{w.ottoman}</span>
            </button>
          ))}
        </div>
      ) : (
        /* Arama yapılmadığında gösterilen zengin Keşfet Modülleri */
        <div className="flex flex-col gap-6">
          {/* Modül 1: Rastgele Keşfet (Zarla) */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="size-4" /> Rastgele Keşfet
                </div>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Günün Şanslı Kelimesi
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sözlükten rastgele bir lügat seçip keşfetmeye başla.
                </p>
              </div>
              <button
                onClick={pickRandomWord}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95 hover:opacity-95"
              >
                <Dice5 className="size-4 animate-spin-slow" />
                Rastgele Getir
              </button>
            </div>
          </div>

          {/* Modül 2: Son Arayışlar */}
          {state.recentSearches.length > 0 && (
            <div>
              <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Clock3 className="size-3.5" /> Son Aradıkların
              </div>
              <div className="flex flex-wrap gap-2">
                {state.recentSearches.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQ(r)}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modül 3: Trend Etiketler & Kategoriler */}
          <div>
            <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Tag className="size-3.5" /> Trend Konular & Etiketler
            </div>
            <div className="flex flex-wrap gap-2">
              {trendTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="flex items-center gap-1 rounded-full border border-primary/20 bg-card px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* Modül 4: Günün Öne Çıkan Kelimeleri */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Compass className="size-3.5" /> Öne Çıkan Kelimeler
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredWords.map((w) => (
                <button
                  key={w.id}
                  onClick={() => openWord(w)}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-3.5 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-lg font-bold text-foreground">{w.tr}</span>
                    <span className="ottoman font-serif text-2xl text-primary">{w.ottoman}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{w.meaning}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {detail && (
        <WordDetailModal
          word={detail}
          onClose={() => setDetail(null)}
          onAddWidget={(w) => setWidgetWord(w)}
        />
      )}

      {widgetWord && (
        <WidgetStudioModal
          word={widgetWord}
          onClose={() => setWidgetWord(null)}
        />
      )}

      {storyWord && (
        <InstagramStoryModal
          word={storyWord}
          onClose={() => setStoryWord(null)}
        />
      )}
    </div>
  )
}
