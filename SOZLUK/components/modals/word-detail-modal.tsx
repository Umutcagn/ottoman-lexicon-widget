'use client'

import type { Word } from '@/types'
import { WordCard } from '@/components/word-card'

export function WordDetailModal({
  word,
  onClose,
  onAddWidget,
}: {
  word: Word
  onClose: () => void
  onAddWidget?: (word: Word) => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        aria-label="Kapat"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="relative mx-auto max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background px-4 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <WordCard word={word} onAddWidget={onAddWidget} />
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-accent/40"
        >
          Kapat
        </button>
      </div>
    </div>
  )
}
