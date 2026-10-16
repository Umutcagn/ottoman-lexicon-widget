'use client'

import { useState, useEffect } from 'react'
import {
  Bell,
  ChevronRight,
  Clock,
  HelpCircle,
  Info,
  Layers,
  LogOut,
  Moon,
  Palette,
  Settings2,
  Sun,
  User,
  Trash2,
} from 'lucide-react'
import type { Purpose, WidgetType, WidgetTheme } from '@/types'
import { cn } from '@/lib/utils'
import { useApp, currentSlot, getDailyWordIndex } from '@/lib/app-store'

import { words } from '@/lib/words'
import { sendInstantTestNotification, scheduleDailyNotification } from '@/lib/notifications'
import { deleteCurrentUserAccount } from '@/lib/firebase'
import {
  LockScreenPreview,
  HomeScreenPreview,
  WidgetSetupGuide,
} from '@/components/widget'


const intervals = [6, 12, 24]
const purposeLabels: Record<Purpose, string> = {
  widget: 'Widget',
  ogrenim: 'Öğrenim',
  arastirma: 'Araştırma',
  ilham: 'İlham',
}

export function ProfileScreen() {
  const { state, update, toggleTheme, togglePurpose, reset } = useApp()
  const [previewType, setPreviewType] = useState<WidgetType>('medium')
  const [previewTheme, setPreviewTheme] = useState<WidgetTheme>('glass')

  const [showGuide, setShowGuide] = useState(false)

  const slotWord =
    words[getDailyWordIndex(currentSlot(state.intervalHours), words.length)]
  const dark = state.theme === 'dark'


  async function syncWidgetLive(theme: WidgetTheme, type: WidgetType, word: any) {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      const { Capacitor } = await import('@capacitor/core')

      await Preferences.set({ key: 'widget_tr', value: word.tr })
      await Preferences.set({ key: 'widget_ottoman', value: word.ottoman })
      await Preferences.set({ key: 'widget_meaning', value: word.meaning })
      await Preferences.set({ key: 'widget_example', value: word.example })
      await Preferences.set({ key: 'widget_theme', value: theme })
      await Preferences.set({ key: 'widget_type', value: type })

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


  useEffect(() => {
    syncWidgetLive(previewTheme, previewType, slotWord)
  }, [previewTheme, previewType, slotWord])



  return (
    <div className="flex flex-col gap-6 px-4 pb-6 pt-5">
      {/* Başlık + dark mode */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Profil & Ayarlar</h1>
        <button
          onClick={toggleTheme}
          aria-label="Tema değiştir"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
        >
          {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
      </div>

      {/* Kullanıcı kartı */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-7" />
        </span>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-bold">{state.displayName}</span>
          <span className="text-xs text-muted-foreground">
            Benzersiz No: {hashId(state.displayName + (state.authMethod || 'guest'))}
          </span>
          <span className="mt-1 inline-flex w-fit items-center rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
            {authLabel(state.authMethod)}
          </span>
        </div>
      </div>

      {/* Dil */}
      <Field label="Uygulama Dili">
        <div className="relative">
          <select
            value={state.language}
            onChange={(e) => update({ language: e.target.value })}
            className="w-full appearance-none rounded-xl border border-border bg-card py-3 pl-4 pr-10 text-sm outline-none font-medium"
          >
            <option>Türkçe</option>
            <option>English</option>
            <option>العربية</option>
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
        </div>
      </Field>

      {/* Widget değişim saati */}
      <Field label="Widget Kelime Değişim Sıklığı">
        <div className="grid grid-cols-3 gap-2">
          {intervals.map((h) => (
            <button
              key={h}
              onClick={() => update({ intervalHours: h })}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border py-3 text-sm transition-all',
                state.intervalHours === h
                  ? 'border-primary bg-primary/10 font-semibold text-foreground shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent/40',
              )}
            >
              <Clock className="size-4 text-primary" />
              Her {h}s
            </button>
          ))}
        </div>
      </Field>

      {/* Kullanım amacı */}
      <Field label="Uygulama Kullanım Amacı">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(purposeLabels) as Purpose[]).map((p) => {
            const active = state.purposes.includes(p)
            return (
              <button
                key={p}
                onClick={() => togglePurpose(p)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm transition-all',
                  active
                    ? 'border-primary bg-primary/10 font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent/40',
                )}
              >
                {purposeLabels[p]}
              </button>
            )
          })}
        </div>
      </Field>

      {/* Interaktif Widget Önizleme & Stüdyo alanı */}
      <Field label="Widget Önizleme & Görünüm Ayarları">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          {/* Tip seçimi */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Layers className="size-3.5" /> Boyut:
            </span>
            <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
              {[
                { id: 'lock', label: 'Kilit' },
                { id: 'small', label: '2x1' },
                { id: 'medium', label: '2x2' },
                { id: 'large', label: '3x2' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const newType = item.id as WidgetType
                    setPreviewType(newType)
                    syncWidgetLive(previewTheme, newType, slotWord)
                  }}
                  className={cn(
                    'rounded-md px-2.5 py-1 transition-all',
                    previewType === item.id
                      ? 'bg-background text-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tema seçimi (ANINDA CANLI EŞİTLEME) */}
          <div className="flex items-center justify-between border-t border-border pt-2.5">
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Palette className="size-3.5" /> Tema:
            </span>
            <div className="flex gap-1 text-xs font-medium">
              {[
                { id: 'midnight', label: 'Gece' },
                { id: 'parchment', label: 'Parşömen' },
                { id: 'aurora', label: 'Aurora' },
                { id: 'glass', label: 'Cam' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    const newTheme = t.id as WidgetTheme
                    setPreviewTheme(newTheme)
                    syncWidgetLive(newTheme, previewType, slotWord)
                  }}
                  className={cn(
                    'rounded-md border px-2 py-0.5 transition-all',
                    previewTheme === t.id
                      ? 'border-primary bg-primary/10 font-semibold text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-accent',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>


          {/* Telefon Simülasyon Görünümü */}
          <div className="my-2 flex justify-center">
            {previewType === 'lock' ? (
              <LockScreenPreview word={slotWord} theme={previewTheme} />
            ) : (
              <HomeScreenPreview
                word={slotWord}
                type={previewType}
                theme={previewTheme}
                intervalHours={state.intervalHours}
              />
            )}
          </div>

          <button
            onClick={async () => {
              try {
                const { Preferences } = await import('@capacitor/preferences')
                const { Capacitor } = await import('@capacitor/core')

                await Preferences.set({ key: 'widget_tr', value: slotWord.tr })
                await Preferences.set({ key: 'widget_ottoman', value: slotWord.ottoman })
                await Preferences.set({ key: 'widget_meaning', value: slotWord.meaning })
                await Preferences.set({ key: 'widget_example', value: slotWord.example })
                await Preferences.set({ key: 'widget_theme', value: previewTheme })
                await Preferences.set({ key: 'widget_type', value: previewType })

                if (Capacitor.isPluginAvailable('WordWidget')) {
                  await Capacitor.Plugins.WordWidget.updateWidget({
                    tr: slotWord.tr,
                    ottoman: slotWord.ottoman,
                    meaning: slotWord.meaning,
                    example: slotWord.example,
                    theme: previewTheme,
                  })
                }
                alert('Widget teması ve kelimesi başarıyla telefona kaydedildi!')
              } catch (e) {
                // ignore
              }
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
          >
            Temayı ve Widget'ı Kaydet
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-accent/40 py-2.5 text-xs font-semibold text-foreground hover:bg-accent"
          >
            <HelpCircle className="size-4 text-primary" />
            {showGuide ? 'Rehberi Gizle' : 'Telefona Widget Ekleme Rehberi'}
          </button>

          {showGuide && <WidgetSetupGuide onClose={() => setShowGuide(false)} />}
        </div>
      </Field>

      {/* 🔔 Günün Kelimesi Bildirim Ayarları */}
      <Field label="Günün Kelimesi Bildirimleri (24 Saatte Bir)">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Her Gün 09:00 Bildirimi</span>
                <span className="text-[11px] text-muted-foreground">Her 24 saatte bir yeni kelime bildirimi düşer</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border pt-3">
            <button
              onClick={async () => {
                await scheduleDailyNotification()
                alert('24 Saatlik Günün Kelimesi bildirimi kuruldu ve aktifleştirildi!')
              }}
              className="flex-1 rounded-xl bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20"
            >
              24 Saatlik Kurumu Yenile
            </button>
            <button
              onClick={async () => {
                const ok = await sendInstantTestNotification()
                if (ok) {
                  alert('Test bildirimi 1 saniye içinde telefonunuza düşecektir!')
                } else {
                  alert('Bildirim izni verilmedi. Lütfen telefon ayarlarından bildirimlere izin verin.')
                }
              }}
              className="flex-1 rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-foreground hover:bg-accent"
            >
              Test Bildirimi Gönder 🔔
            </button>
          </div>
        </div>
      </Field>


      {/* Menü */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <MenuRow icon={<Settings2 className="size-5" />} label="Hesap Tercihleri" />
        <MenuRow icon={<Info className="size-5" />} label="Hakkımızda & Lisanslar" />
        <MenuRow icon={<HelpCircle className="size-5" />} label="Yardım & Destek" />
      </div>

      <button
        onClick={() => {
          localStorage.clear()
          reset()
          update({ onboarded: false })
        }}
        className="flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
      >
        <User className="size-4" />
        Giriş & Onboarding Ekranına Dön (Sıfırla)
      </button>

      <button
        onClick={() => {
          localStorage.clear()
          reset()
        }}
        className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/40"
      >
        <LogOut className="size-4" />
        Oturumu Kapat
      </button>

      <button
        onClick={async () => {
          const confirmed = window.confirm(
            'Hesabınızı ve kaydedilen tüm verilerinizi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
          )
          if (!confirmed) return
          try {
            await deleteCurrentUserAccount()
          } catch (e) {
            console.error('Account delete failed', e)
          }
          reset()
          update({ onboarded: false })
        }}
        className="flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15"
      >
        <Trash2 className="size-4" />
        Hesabımı ve Verilerimi Sil
      </button>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Ottoman Dict · Osmanlıca Sözlük v1.2
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  )
}

function MenuRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left text-sm transition-colors last:border-b-0 hover:bg-accent/40">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  )
}

function authLabel(m: string | null) {
  switch (m) {
    case 'google':
      return 'Google ile giriş'
    case 'apple':
      return 'Apple ID ile giriş'
    case 'mail':
      return 'E-posta ile giriş'
    case 'phone':
      return 'Telefon ile giriş'
    default:
      return 'Misafir Kullanıcı'
  }
}

function hashId(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return String(10000 + (h % 90000))
}
