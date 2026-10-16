'use client'

import { useState } from 'react'
import { Heart, HeartOff } from 'lucide-react'
import type { Word } from '@/types'
import { words } from '@/lib/words'
import { useApp } from '@/lib/app-store'
import { WordDetailModal } from '@/components/modals/word-detail-modal'
import { WidgetStudioModal } from '@/components/widget'

export function SavedScreen() {
  const { state, toggleSaved } = useApp()
  const [detail, setDetail] = useState<Word | null>(null)
  const [widgetWord, setWidgetWord] = useState<Word | null>(null)

  const saved = state.savedIds
    .map((id) => words.find((w) => w.id === id))
    .filter((w): w is Word => Boolean(w))

  return (
    <div className="flex flex-col gap-5 px-4 pb-4 pt-5">
      <div>
        <h1 className="mb-1 font-serif text-2xl font-bold">Kaydedilenler</h1>
        <p className="text-sm text-muted-foreground">
          {saved.length > 0
            ? `${saved.length} kelime kaydedildi`
            : 'Beğendiğin kelimeleri buraya ekle'}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted">
            <HeartOff className="size-6 text-muted-foreground" />
          </span>
          <p className="max-w-[15rem] text-pretty text-sm text-muted-foreground">
            Henüz kayıtlı kelimen yok. Bir kelimenin kalp simgesine dokunarak kaydet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {saved.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <button onClick={() => setDetail(w)} className="flex flex-1 items-center gap-3 text-left">
                <span className="ottoman flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-serif text-2xl text-primary">
                  {w.ottoman}
                </span>
                <span className="flex flex-col">
                  <span className="font-serif text-lg font-bold leading-tight">{w.tr}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">{w.meaning}</span>
                </span>
              </button>
              <button
                onClick={() => toggleSaved(w.id)}
                aria-label="Kaydedilenlerden çıkar"
                className="flex size-9 items-center justify-center rounded-full hover:bg-accent"
              >
                <Heart className="size-5 fill-gold text-gold" />
              </button>
            </div>
          ))}
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
    </div>
  )
}
