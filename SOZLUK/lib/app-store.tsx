'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { AppState, AuthMethod, Purpose } from '@/types'
import { words } from './words'

export type { AppState, AuthMethod, Purpose }

const STORAGE_KEY = 'ottoman-dict-v1'

const defaultState: AppState = {
  onboarded: false,
  authMethod: null,
  displayName: 'Misafir',
  intervalHours: 12,
  purposes: ['widget', 'ogrenim'],
  savedIds: [],
  recentSearches: [],
  theme: 'light',
  language: 'Türkçe',
}

type Ctx = {
  state: AppState
  ready: boolean
  update: (patch: Partial<AppState>) => void
  toggleSaved: (id: string) => void
  isSaved: (id: string) => boolean
  togglePurpose: (p: Purpose) => void
  addRecent: (q: string) => void
  toggleTheme: () => void
  reset: () => void
}

const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setState({ ...defaultState, ...parsed })
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, ready])

  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.theme])

  useEffect(() => {
    if (!ready) return
    
    // Sync current slot word to native Capacitor preferences
    const slot = currentSlot(state.intervalHours)
    const idx = getDailyWordIndex(slot, words.length)
    const word = words[idx]
    
    if (word) {
      import('@capacitor/preferences').then(({ Preferences }) => {
        Preferences.set({ key: 'widget_tr', value: word.tr })
        Preferences.set({ key: 'widget_ottoman', value: word.ottoman })
        Preferences.set({ key: 'widget_meaning', value: word.meaning })
        
        import('@capacitor/core').then(({ Capacitor }) => {
          if (Capacitor.isPluginAvailable('WordWidget')) {
            Capacitor.Plugins.WordWidget.updateWidget()
          }
        })
      }).catch(() => {})
    }

    // Schedule 24h Daily Word Notification
    import('./notifications').then(({ scheduleDailyNotification }) => {
      scheduleDailyNotification()
    }).catch(() => {})
  }, [state.intervalHours, ready])


  const value = useMemo<Ctx>(() => {
    const update = (patch: Partial<AppState>) =>
      setState((s) => ({ ...s, ...patch }))

    return {
      state,
      ready,
      update,
      toggleSaved: (id) =>
        setState((s) => ({
          ...s,
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [id, ...s.savedIds],
        })),
      isSaved: (id) => state.savedIds.includes(id),
      togglePurpose: (p) =>
        setState((s) => ({
          ...s,
          purposes: s.purposes.includes(p)
            ? s.purposes.filter((x) => x !== p)
            : [...s.purposes, p],
        })),
      addRecent: (q) =>
        setState((s) => {
          const cleaned = q.trim()
          if (!cleaned) return s
          const next = [cleaned, ...s.recentSearches.filter((x) => x !== cleaned)]
          return { ...s, recentSearches: next.slice(0, 8) }
        }),
      toggleTheme: () =>
        setState((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' })),
      reset: () => setState(defaultState),
    }
  }, [state, ready])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Aktif zaman dilimine göre günün kelime slotu
export function currentSlot(intervalHours: number): number {
  const hours = Math.floor(Date.now() / (1000 * 60 * 60))
  return Math.floor(hours / Math.max(1, intervalHours))
}

// Günlük kelimeleri rastgele (non-alphabetical) seçen deterministik karma fonksiyonu
export function getDailyWordIndex(slot: number, total: number = words.length): number {
  if (!total || total <= 0) return 0
  const hash = Math.abs(Math.sin(slot + 42) * 100000)
  return Math.floor(hash) % total
}

