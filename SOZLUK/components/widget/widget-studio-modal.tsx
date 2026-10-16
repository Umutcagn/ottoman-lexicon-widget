'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, HelpCircle, Layers, Palette, X } from 'lucide-react'
import type { Word, WidgetType, WidgetTheme } from '@/types'
import { themeStyles } from '@/constants/widget-themes'
import { useApp } from '@/lib/app-store'
import { cn } from '@/lib/utils'
import { LockScreenPreview } from './lock-screen-preview'
import { HomeScreenPreview } from './home-screen-preview'
import { WidgetSetupGuide } from './widget-setup-guide'

export function WidgetStudioModal({
  word,
  onClose,
}: {
  word: Word
  onClose: () => void
}) {
  const { state } = useApp()
  const [widgetType, setWidgetType] = useState<WidgetType>('medium')
  const [theme, setTheme] = useState<WidgetTheme>('glass')

  const [copied, setCopied] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  // Native Android Widget Sync
  useEffect(() => {
    async function syncToNativeWidget() {
      try {
        const { Preferences } = await import('@capacitor/preferences')
        const { Capacitor } = await import('@capacitor/core')

        await Preferences.set({ key: 'widget_tr', value: word.tr })
        await Preferences.set({ key: 'widget_ottoman', value: word.ottoman })
        await Preferences.set({ key: 'widget_meaning', value: word.meaning })
        await Preferences.set({ key: 'widget_example', value: word.example })
        await Preferences.set({ key: 'widget_theme', value: theme })
        await Preferences.set({ key: 'widget_type', value: widgetType })

        if (Capacitor.isPluginAvailable('WordWidget')) {
          await Capacitor.Plugins.WordWidget.updateWidget({
            tr: word.tr,
            ottoman: word.ottoman,
            meaning: word.meaning,
            example: word.example,
            theme: theme,
          })
        }
      } catch (e) {
        // ignore
      }
    }
    syncToNativeWidget()
  }, [word, theme, widgetType])

  function copyWidgetText() {
    const text = `Osmanlıca: ${word.ottoman}\nTürkçe: ${word.tr}\nAnlamı: ${word.meaning}\n(Ottoman Dict Widget)`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Kapat"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity"
      />
      <div className="relative mx-auto flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl border border-border bg-background px-5 pb-6 pt-4 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <h3 className="font-serif text-xl font-bold">Widget Stüdyosu</h3>
          </div>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-muted hover:bg-accent text-muted-foreground"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tip Seçimi (Tabs) */}
        <div className="mb-4 grid grid-cols-4 gap-1.5 rounded-xl bg-muted p-1 text-xs">
          {[
            { id: 'lock', label: 'Kilit' },
            { id: 'small', label: '2x1' },
            { id: 'medium', label: '2x2' },
            { id: 'large', label: '3x2' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setWidgetType(item.id as WidgetType)}
              className={cn(
                'rounded-lg py-1.5 font-semibold transition-all',
                widgetType === item.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tema Seçimi */}
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Palette className="size-3.5" /> Tema:
          </span>
          <div className="flex gap-1.5">
            {(Object.keys(themeStyles) as WidgetTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-medium transition-all',
                  theme === t
                    ? 'border-primary bg-primary/10 text-foreground font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent/40',
                )}
              >
                {themeStyles[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Canlı Önizleme */}
        <div className="my-2 flex justify-center">
          {widgetType === 'lock' ? (
            <LockScreenPreview word={word} theme={theme} />
          ) : (
            <HomeScreenPreview
              word={word}
              type={widgetType}
              theme={theme}
              intervalHours={state.intervalHours}
            />
          )}
        </div>

        {/* Widget Rehberi veya Açıklama */}
        {showGuide ? (
          <div className="mt-4">
            <WidgetSetupGuide onClose={() => setShowGuide(false)} />
          </div>
        ) : (
          <>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{word.tr}</span> kelimesi widget
              stilinizde gösteriliyor. Kelimeniz her{' '}
              <span className="font-semibold text-primary">{state.intervalHours} saatte</span> bir
              otomatik değişir.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={copyWidgetText}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-accent"
              >
                {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                {copied ? 'Kopyalandı!' : 'Metni Kopyala'}
              </button>

              <button
                onClick={() => setShowGuide(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-accent"
              >
                <HelpCircle className="size-4 text-primary" />
                Nasıl Eklenir?
              </button>
            </div>

            <button
              onClick={async () => {
                setCopied(true)
                try {
                  const { Preferences } = await import('@capacitor/preferences')
                  const { Capacitor } = await import('@capacitor/core')

                  await Preferences.set({ key: 'widget_tr', value: word.tr })
                  await Preferences.set({ key: 'widget_ottoman', value: word.ottoman })
                  await Preferences.set({ key: 'widget_meaning', value: word.meaning })
                  await Preferences.set({ key: 'widget_example', value: word.example })
                  await Preferences.set({ key: 'widget_theme', value: theme })
                  await Preferences.set({ key: 'widget_type', value: widgetType })

                  if (Capacitor.isPluginAvailable('WordWidget')) {
                    await Capacitor.Plugins.WordWidget.updateWidget({
                      tr: word.tr,
                      ottoman: word.ottoman,
                      meaning: word.meaning,
                      example: word.example,
                      theme: theme,
                    })
                  }
                } catch (e) {
                  // ignore
                }
                setTimeout(() => onClose(), 800)
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition-all"
            >
              <Check className="size-4" />
              {copied ? 'Tema ve Widget Kaydedildi!' : 'Temayı ve Widget\'ı Kaydet'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Re-export as WidgetSheet for backward compatibility if needed
export { WidgetStudioModal as WidgetSheet }
