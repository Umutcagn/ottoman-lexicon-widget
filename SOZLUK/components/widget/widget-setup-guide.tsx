'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WidgetSetupGuide({ onClose }: { onClose: () => void }) {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios')

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" />
          <h4 className="font-serif font-bold text-base">Widget Nasıl Eklenir?</h4>
        </div>
        <div className="flex rounded-lg bg-muted p-0.5">
          <button
            onClick={() => setPlatform('ios')}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
              platform === 'ios'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            iOS (iPhone)
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
              platform === 'android'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            Android
          </button>
        </div>
      </div>

      {platform === 'ios' ? (
        <ol className="flex flex-col gap-2.5 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              1
            </span>
            <span>
              Kilit ekranını veya Ana ekran boş bir alanını{' '}
              <strong className="text-foreground">basılı tutun</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              2
            </span>
            <span>
              Sol üstteki <strong className="text-foreground">+ (Ekle)</strong> butonuna tıklayın.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              3
            </span>
            <span>
              Arama çubuğuna <strong className="text-foreground">Ottoman Dict</strong> yazın.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              4
            </span>
            <span>İstediğiniz widget boyutunu seçip ekleyin.</span>
          </li>
        </ol>
      ) : (
        <ol className="flex flex-col gap-2.5 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              1
            </span>
            <span>
              Ana ekranda boş bir yere <strong className="text-foreground">basılı tutun</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              2
            </span>
            <span>
              Açılan menüden <strong className="text-foreground">Widget'lar</strong> sekmesini seçin.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              3
            </span>
            <span>
              <strong className="text-foreground">Ottoman Dict</strong> uygulamasını bulun ve sürükleyin.
            </span>
          </li>
        </ol>
      )}

      <button
        onClick={onClose}
        className="mt-1 w-full rounded-xl bg-accent py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/80"
      >
        Anladım
      </button>
    </div>
  )
}
