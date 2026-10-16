'use client'

import { Heart, Home, Search, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { NavigationTab } from '@/types'

export type Tab = NavigationTab

const items: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'search', label: 'Arama', icon: Search },
  { id: 'saved', label: 'Kayıtlı', icon: Heart },
  { id: 'profile', label: 'Profil', icon: Settings },
]

export function BottomNav({
  active,
  onChange,
  savedCount,
}: {
  active: Tab
  onChange: (t: Tab) => void
  savedCount: number
}) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const Icon = it.icon
          const isActive = active === it.id
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative">
                <Icon className={cn('size-5.5', isActive && it.id === 'saved' && 'fill-primary/20')} />
                {it.id === 'saved' && savedCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-gold-foreground">
                    {savedCount}
                  </span>
                )}
              </span>
              {it.label}
              {isActive && (
                <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
