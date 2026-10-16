export type Word = {
  id: string
  tr: string // Latin harflerle okunuşu
  ottoman: string // Osmanlıca (Arap harfli) yazımı
  meaning: string // Anlamı
  usageSource: string // Kullanım kaynağı etiketi (Edebiyat, Gazete, Tasavvuf...)
  usage: string // Kullanım açıklaması
  example: string // Örnek cümle / beyit
  tags: string[]
}

export type AuthMethod = 'google' | 'mail' | 'phone' | 'apple' | 'guest'

export type Purpose = 'widget' | 'ogrenim' | 'arastirma' | 'ilham'

export type AppState = {
  onboarded: boolean
  authMethod: AuthMethod | null
  displayName: string
  intervalHours: number
  purposes: Purpose[]
  savedIds: string[]
  recentSearches: string[]
  theme: 'light' | 'dark'
  language: string
}

export type WidgetType = 'lock' | 'small' | 'medium' | 'large'

export type WidgetTheme = 'midnight' | 'parchment' | 'aurora' | 'glass'

export type NavigationTab = 'home' | 'search' | 'saved' | 'profile'
