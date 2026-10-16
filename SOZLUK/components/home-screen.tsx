'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Word } from '@/types'
import { words } from '@/lib/words'
import { currentSlot, useApp } from '@/lib/app-store'
import { cn } from '@/lib/utils'
import { WordCard } from '@/components/word-card'
import { WidgetStudioModal } from '@/components/widget'

export function HomeScreen() {
  const { state } = useApp()
  
  // Slot bazlı başlangıç kelimesi
  const startSlot = useMemo(
    () => ((currentSlot(state.intervalHours) % words.length) + words.length) % words.length,
    [state.intervalHours],
  )
  
  const [index, setIndex] = useState(startSlot)
  const [dragY, setDragY] = useState(0)
  const [animating, setAnimating] = useState<'none' | 'up' | 'down' | 'reset'>('none')
  const [widgetWord, setWidgetWord] = useState<Word | null>(null)
  
  const startY = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Virtualization: Sadece 3 kelimeyi DOM'da tutacağız
  const prevIndex = (index - 1 + words.length) % words.length
  const nextIndex = (index + 1) % words.length

  const activeWord = words[index]
  const prevWord = words[prevIndex]
  const nextWord = words[nextIndex]

  // Aktif kelime değiştiğinde veya snap gerçekleştiğinde widget'ı otomatik eşitle (Görünürlük Kontrolü)
  useEffect(() => {
    async function syncActiveWordToWidget() {
      try {
        const { Preferences } = await import('@capacitor/preferences')
        const { Capacitor } = await import('@capacitor/core')

        await Preferences.set({ key: 'widget_tr', value: activeWord.tr })
        await Preferences.set({ key: 'widget_ottoman', value: activeWord.ottoman })
        await Preferences.set({ key: 'widget_meaning', value: activeWord.meaning })
        await Preferences.set({ key: 'widget_example', value: activeWord.example })

        if (Capacitor.isPluginAvailable('WordWidget')) {
          const themePref = await Preferences.get({ key: 'widget_theme' })
          await Capacitor.Plugins.WordWidget.updateWidget({
            tr: activeWord.tr,
            ottoman: activeWord.ottoman,
            meaning: activeWord.meaning,
            example: activeWord.example,
            theme: themePref.value || 'midnight',
          })
        }
      } catch (e) {
        // ignore
      }
    }
    syncActiveWordToWidget()
  }, [index, activeWord])

  function goNext() {
    if (animating !== 'none') return
    setAnimating('up')
    // Animatör geçişinden sonra index kaydır
    setTimeout(() => {
      setIndex((i) => (i + 1) % words.length)
      setDragY(0)
      setAnimating('none')
    }, 280)
  }

  function goPrev() {
    if (animating !== 'none') return
    setAnimating('down')
    setTimeout(() => {
      setIndex((i) => (i - 1 + words.length) % words.length)
      setDragY(0)
      setAnimating('none')
    }, 280)
  }

  // Pointer/Touch hareketleri
  function onPointerDown(e: React.PointerEvent) {
    if (animating !== 'none') return
    startY.current = e.clientY
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startY.current === null || animating !== 'none') return
    const diff = e.clientY - startY.current
    // Yumuşak sürükleme hissi
    setDragY(diff)
  }

  function onPointerUp() {
    if (startY.current === null || animating !== 'none') return
    const containerHeight = containerRef.current?.clientHeight || 500
    const threshold = containerHeight * 0.2 // %20 kaydırma eşiği (Hizalama/Snap)

    if (dragY < -threshold) {
      // Yukarı hızlı kaydırma -> Sonraki kelime
      goNext()
    } else if (dragY > threshold) {
      // Aşağı hızlı kaydırma -> Önceki kelime
      goPrev()
    } else {
      // Eşik geçilemedi -> Geri yapış (Snap reset)
      setAnimating('reset')
      setTimeout(() => {
        setDragY(0)
        setAnimating('none')
      }, 200)
    }
    startY.current = null
  }

  // Animasyon stilleri (Shorts / Reels geçiş efekti - CSS yüzdeleri ile sıfır taşma garantili)
  const getCardStyle = (position: 'prev' | 'active' | 'next') => {
    const isDragging = startY.current !== null
    // Sadece aktif animasyon veya sıfırlama anında geçiş efekti ver (Gereksiz animasyon sıçramalarını önler)
    const hasTransition = animating !== 'none'
    const transitionClass = hasTransition ? 'transition-transform duration-300 ease-out' : ''

    let transform = ''
    
    if (animating === 'up') {
      if (position === 'prev') transform = 'translateY(calc(-200% - 32px))'
      else if (position === 'next') transform = 'translateY(0)'
      else transform = 'translateY(calc(-100% - 16px))' // active
    } else if (animating === 'down') {
      if (position === 'prev') transform = 'translateY(0)'
      else if (position === 'next') transform = 'translateY(calc(200% + 32px))'
      else transform = 'translateY(calc(100% + 16px))' // active
    } else if (animating === 'reset') {
      if (position === 'prev') transform = 'translateY(calc(-100% - 16px))'
      else if (position === 'next') transform = 'translateY(calc(100% + 16px))'
      else transform = 'translateY(0)' // active
    } else {
      // Normal sürükleme veya bekleme
      if (position === 'prev') transform = `translateY(calc(-100% - 16px + ${dragY}px))`
      else if (position === 'next') transform = `translateY(calc(100% + 16px + ${dragY}px))`
      else transform = `translateY(${dragY}px)` // active
    }

    return {
      style: {
        transform,
      },
      className: cn(
        'absolute inset-0 w-full h-full select-none',
        transitionClass,
      ),
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 pt-5 h-full overflow-hidden">
      {/* Üst Bar */}
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Günün Kelimesi
          </p>
          <h1 className="font-serif text-2xl font-bold">Ottoman Dict</h1>
        </div>
      </div>

      {/* Kaydırma Alanı (Shorts Container - Tam Ekran Boyutlu) */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[400px] overflow-hidden touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => startY.current !== null && onPointerUp()}
      >
        {/* Önceki Kelime (Sanal - Aynı Arayüz Yapısı ve Key Eşleme) */}
        <div key={`card-${prevWord.id}`} {...getCardStyle('prev')}>
          <WordCard 
            word={prevWord} 
            onAddWidget={(w) => setWidgetWord(w)} 
            onClick={() => setWidgetWord(prevWord)}
          />
        </div>

        {/* Aktif Kelime */}
        <div key={`card-${activeWord.id}`} {...getCardStyle('active')}>
          <WordCard 
            word={activeWord} 
            onAddWidget={(w) => setWidgetWord(w)} 
            onClick={() => setWidgetWord(activeWord)}
          />
        </div>

        {/* Sonraki Kelime (Sanal - Aynı Arayüz Yapısı ve Key Eşleme) */}
        <div key={`card-${nextWord.id}`} {...getCardStyle('next')}>
          <WordCard 
            word={nextWord} 
            onAddWidget={(w) => setWidgetWord(w)} 
            onClick={() => setWidgetWord(nextWord)}
          />
        </div>
      </div>

      {widgetWord && <WidgetStudioModal word={widgetWord} onClose={() => setWidgetWord(null)} />}
    </div>
  )
}


