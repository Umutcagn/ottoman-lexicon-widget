'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, Share2, Sparkles, X } from 'lucide-react'
import type { Word } from '@/lib/words'
import { formatMeaning } from '@/lib/utils'


export function InstagramStoryModal({
  word,
  onClose,
}: {
  word: Word
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const shareText = `✨ ${word.tr} (${word.ottoman})\n\n📖 Anlamı: ${word.meaning}\n\n💬 Örnek: “${word.example}”\n\n📌 Ottoman Dict — Günün Osmanlıca Kelimesi`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ottoman Dict - ${word.tr}`,
          text: shareText,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
        return
      } catch (e) {
        // Fallback to copy
      }
    }
    navigator.clipboard?.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCopy() {
    navigator.clipboard?.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Arka plan karartma ve blur */}
      <button
        aria-label="Kapat"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/70 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-sm flex-col items-center gap-3 overflow-y-auto rounded-3xl p-1 no-scrollbar">
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          className="self-end rounded-full bg-card/90 p-2 text-foreground shadow-lg backdrop-blur hover:bg-accent"
          aria-label="Kapat"
        >
          <X className="size-5" />
        </button>

        {/* 9:16 Instagram Story Kartı */}
        <div className="relative flex w-full max-h-[58vh] aspect-[9/16] flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-5 shadow-2xl text-white">
          {/* Arka plan ışık efektleri */}
          <div className="pointer-events-none absolute -left-12 -top-12 size-48 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-purple-500/20 blur-3xl" />

          {/* Üst Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                <Sparkles className="size-3.5" />
              </span>
              <span className="font-serif text-xs font-bold tracking-wide text-amber-200">
                Ottoman Dict
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
              Günün Kelimesi
            </span>
          </div>

          {/* Orta İçerik (Osmanlıca + Türkçe) */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center gap-2.5 py-2">
            {/* Osmanlıca Hat */}
            <p className="ottoman font-serif text-5xl leading-tight text-amber-400 drop-shadow-md">
              {word.ottoman}
            </p>

            {/* Türkçe Kelime */}
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
              {word.tr}
            </h2>

            {/* Anlamı */}
            <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-0.5">
                ANLAMI
              </p>
              <p className="text-xs leading-relaxed text-slate-200">
                {formatMeaning(word.meaning)}
              </p>

            </div>

            {/* Örnek Cümle */}
            <div className="w-full border-l-2 border-amber-400/80 pl-2.5 text-left">
              <p className="font-serif text-[11px] italic text-amber-100/90 leading-relaxed line-clamp-2">
                “{word.example}”
              </p>
            </div>
          </div>

          {/* Alt Filigran / Branding */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/60">
            <span>#OttomanDict #GününKelimesi</span>
            <span className="font-semibold text-amber-300">@ottomandict</span>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex w-full gap-2 pt-1">
          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 shadow-lg transition-transform active:scale-95 hover:opacity-95"
          >
            <Share2 className="size-4" />
            {shared ? 'Paylaşıldı!' : 'Paylaş'}
          </button>


          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-md hover:bg-accent"
          >
            {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
