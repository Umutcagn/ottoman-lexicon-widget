'use client'

import { useState } from 'react'
import { BookOpen, Heart, Quote, Share2, Sparkles } from 'lucide-react'
import { cn, formatMeaning } from '@/lib/utils'
import { useApp } from '@/lib/app-store'
import type { Word } from '@/lib/words'
import { InstagramStoryModal } from '@/components/modals/instagram-story-modal'


export function WordCard({
  word,
  onAddWidget,
  onClick,
}: {
  word: Word
  onAddWidget?: (w: Word) => void
  onClick?: () => void
}) {
  const { isSaved, toggleSaved } = useApp()
  const saved = isSaved(word.id)
  const [showStoryModal, setShowStoryModal] = useState(false)

  return (
    <>
      <article
        onClick={onClick}
        className={cn(
          "flex flex-col h-full w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm select-none",
          onClick && "cursor-pointer hover:border-primary/30 transition-colors"
        )}
      >
        {/* Başlık: Osmanlıca hat + okunuş */}
        <header className="relative flex flex-col items-center gap-3 border-b border-border bg-gradient-to-b from-primary/[0.06] to-transparent px-6 pb-6 pt-8">
          {/* Üst Sağ Aksiyon İkonları: Paylaşım Simgesi & Favori Simgesi */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowStoryModal(true)
              }}
              aria-label="Story'de Paylaş"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Share2 className="size-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleSaved(word.id)
              }}
              aria-label={saved ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
              aria-pressed={saved}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur transition-colors hover:bg-accent"
            >
              <Heart
                className={cn('size-5 transition-colors', saved ? 'fill-gold text-gold' : 'text-muted-foreground')}
              />
            </button>
          </div>

          <p className="ottoman font-serif text-6xl leading-tight text-foreground">{word.ottoman}</p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">{word.tr}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {word.usageSource}
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-between gap-4 px-6 pb-6 pt-5">
          <div className="flex flex-col gap-4">
            <Section icon={<BookOpen className="size-4" />} title="Anlamı">
              <p className="text-pretty text-[15px] leading-relaxed text-foreground">{formatMeaning(word.meaning)}</p>
            </Section>


            <Section icon={<Quote className="size-4" />} title="Örnek">
              <p className="ottoman-example border-l-2 border-gold/60 pl-4 font-serif text-lg italic leading-relaxed text-foreground">
                “{word.example}”
              </p>
            </Section>

            {word.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {word.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Alt Buton: Widget'e Ekle - Kartın En Altına Konumlandırıldı */}
          {onAddWidget && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddWidget(word)
              }}
              className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f4c45] px-4 py-4 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95"
            >
              Widget’e Ekle
            </button>
          )}
        </div>

      </article>

      {showStoryModal && (
        <InstagramStoryModal
          word={word}
          onClose={() => setShowStoryModal(false)}
        />
      )}
    </>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}
