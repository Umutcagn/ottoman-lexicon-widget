'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import type { AuthMethod, Purpose } from '@/types'
import { useApp } from '@/lib/app-store'
import { cn } from '@/lib/utils'
import { BrandMark, Wordmark } from '@/components/brand'
import { sendPasswordReset, signInWithEmail, signUpWithEmail } from '@/lib/firebase'




type Step = 'login' | 'consent' | 'preferences'
type AuthModalType = 'google' | 'apple' | null


const purposeOptions: { id: Purpose; label: string; desc: string }[] = [
  { id: 'widget', label: 'Widget', desc: 'Kilit ekranımda kelime görmek için' },
  { id: 'ogrenim', label: 'Öğrenim', desc: 'Osmanlıca öğrenmek istiyorum' },
  { id: 'arastirma', label: 'Araştırma', desc: 'Metin ve kaynak çalışması' },
  { id: 'ilham', label: 'İlham', desc: 'Yazı ve içerik için ilham' },
]

const intervals = [6, 12, 24]

// Strict Validation Helpers
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

function isValidPassword(password: string): boolean {
  return password.trim().length >= 6
}

function isValidPhone(p: string): boolean {
  const digits = p.replace(/\D/g, '')
  return digits.length === 10 && digits.startsWith('5')
}

export function OnboardingScreen() {
  const { state, update, togglePurpose } = useApp()
  const [step, setStep] = useState<Step>('login')
  const [consent, setConsent] = useState(false)
  const [activeModal, setActiveModal] = useState<AuthModalType>(null)

  function completeLogin(method: AuthMethod, name: string) {
    update({ authMethod: method, displayName: name })
    setActiveModal(null)
    setStep('consent')
  }

  return (
    <div className="flex min-h-full flex-col px-6 pb-10 pt-8">
      {/* Adım göstergesi */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {(['login', 'consent', 'preferences'] as Step[]).map((s, i) => {
          const active = ['login', 'consent', 'preferences'].indexOf(step) >= i
          return (
            <span
              key={s}
              className={cn(
                'h-1.5 rounded-full transition-all',
                active ? 'w-8 bg-[#0f4c45]' : 'w-4 bg-border',
              )}
            />
          )
        })}
      </div>

      {step === 'login' && (
        <LoginStep
          onLoginSuccess={(method, name) => completeLogin(method, name)}
          onOpenGoogleModal={() => setActiveModal('google')}
          onOpenAppleModal={() => setActiveModal('apple')}
        />
      )}


      {step === 'consent' && (
        <ConsentStep
          consent={consent}
          setConsent={setConsent}
          onBack={() => setStep('login')}
          onNext={() => setStep('preferences')}
        />
      )}

      {step === 'preferences' && (
        <PreferencesStep
          intervalHours={state.intervalHours}
          purposes={state.purposes}
          onInterval={(h) => update({ intervalHours: h })}
          onToggle={togglePurpose}
          onFinish={() => update({ onboarded: true })}
        />
      )}

      {/* Auth Modals */}
      {activeModal === 'google' && (
        <GoogleAuthModal
          onClose={() => setActiveModal(null)}
          onSuccess={(name) => completeLogin('google', name)}
        />
      )}

      {activeModal === 'apple' && (
        <AppleAuthModal
          onClose={() => setActiveModal(null)}
          onSuccess={(name) => completeLogin('apple', name)}
        />
      )}
    </div>
  )
}

// Re-export for compatibility
export { OnboardingScreen as Onboarding }

/* ========================================================================== */
/* 🔑 Main Login & Register Screen (With Kaydol mode & strict validation)     */
/* ========================================================================== */
function LoginStep({
  onLoginSuccess,
  onOpenGoogleModal,
  onOpenAppleModal,
}: {
  onLoginSuccess: (method: AuthMethod, name: string) => void
  onOpenGoogleModal: () => void
  onOpenAppleModal: () => void
}) {


  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (isRegisterMode && fullName.trim().length < 2) {
      setError('Lütfen adınızı ve soyadınızı giriniz.')
      return
    }

    if (!isValidEmail(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz (örn: ad@domain.com).')
      return
    }

    if (!isValidPassword(password)) {
      setError('Şifreniz en az 6 karakter olmalıdır.')
      return
    }

    setLoading(true)
    try {
      if (isRegisterMode) {
        const name = await signUpWithEmail(email, password, fullName.trim())
        onLoginSuccess('mail', name)
      } else {
        const name = await signInWithEmail(email, password)
        onLoginSuccess('mail', name)
      }
    } catch (err: any) {
      setError(err?.message || 'Giriş yapılırken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full py-2">
      {/* Top Logo & Welcome Title */}
      <div className="mb-4 flex flex-col items-center text-center">
        <BrandMark className="mb-2.5 size-13 text-2xl rounded-2xl shadow-sm bg-[#0f4c45] text-white" />
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          {isRegisterMode ? 'Hesap Oluştur' : 'Tekrar Hoş Geldiniz!'}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {isRegisterMode
            ? 'Osmanlıca lügat dünyasına katılmak için bilgilerinizi girin.'
            : 'Osmanlıca lügat dünyasına erişmek ve öğrenmeye devam etmek için giriş yapın.'}
        </p>
      </div>

      {/* 2-Tab Switcher: Giriş Yap | Kaydol */}
      <div className="mb-4 flex rounded-2xl bg-muted p-1 border border-border">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(false)
            setError(null)
          }}
          className={cn(
            'flex-1 rounded-xl py-2.5 text-xs font-bold transition-all',
            !isRegisterMode
              ? 'bg-[#0f4c45] text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          🔑 Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(true)
            setError(null)
          }}
          className={cn(
            'flex-1 rounded-xl py-2.5 text-xs font-bold transition-all',
            isRegisterMode
              ? 'bg-[#0f4c45] text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          📝 Kaydol
        </button>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
          {!isRegisterMode && (
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true)
                setError(null)
              }}
              className="mt-1 w-full rounded-xl bg-[#0f4c45] py-2 text-xs font-bold text-white shadow-xs hover:opacity-95"
            >
              Kaydol Sekmesine Geç ve Hesap Oluştur ➔
            </button>
          )}
        </div>
      )}


      {/* Main Mail Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Name Field (Register Mode Only) */}
        {isRegisterMode && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  setError(null)
                }}
                placeholder="Ahmet Yılmaz"
                className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none ring-primary/30 transition focus:ring-2 focus:border-primary shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-foreground">
            E-posta Adresi
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              placeholder="ornek@email.com"
              className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none ring-primary/30 transition focus:ring-2 focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-foreground">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              placeholder="En az 6 karakter"
              className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-11 text-sm outline-none ring-primary/30 transition focus:ring-2 focus:border-primary shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
          {!isRegisterMode && (
            <div className="mt-1 text-right">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-[#0f4c45] hover:underline"
              >
                Şifremi Unuttum?
              </button>
            </div>
          )}
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f4c45] py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99] hover:opacity-95 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="size-4.5 animate-spin" />
              <span>İşlem yapılıyor...</span>
            </>
          ) : isRegisterMode ? (
            'Kaydol ve Devam Et'
          ) : (
            'Giriş Yap'
          )}
        </button>

      </form>

      {/* Kaydol / Giriş Yap Mode Toggle */}
      <div className="mt-3.5 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode)
            setError(null)
          }}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {isRegisterMode ? (
            <>
              Zaten hesabın var mı?{' '}
              <span className="font-bold text-[#0f4c45] underline">Giriş Yap</span>
            </>
          ) : (
            <>
              Hesabın yok mu?{' '}
              <span className="font-bold text-[#0f4c45] underline">Kaydol</span>
            </>
          )}
        </button>
      </div>

      {/* VEYA Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="w-full border-t border-border" />
        <span className="absolute bg-background px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          VEYA
        </span>
      </div>

      {/* Social & Alternative Buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenGoogleModal}
          className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent/40 active:scale-[0.99]"
        >
          <GoogleGlyph />
          Google ile Devam Et
        </button>

        <button
          type="button"
          onClick={onOpenAppleModal}
          className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent/40 active:scale-[0.99]"
        >
          <AppleGlyph />
          Apple ile Devam Et
        </button>
      </div>


      {/* Şifremi Unuttum Modalı */}

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  )
}

/* ========================================================================== */
/* ❓ Şifremi Unuttum Modalı                                                  */
/* ========================================================================== */
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isValidEmail(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.')
      return
    }

    setLoading(true)
    try {
      await sendPasswordReset(email)
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Sıfırlama e-postası gönderilemedi.')
    } finally {
      setLoading(false)
    }
  }


  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </span>
          <h3 className="font-serif text-xl font-bold">Şifremi Unuttum</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            E-posta adresinizi girin, sıfırlama bağlantısını hemen gönderelim.
          </p>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-semibold text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="flex flex-col items-center text-center py-2">
            <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-green-500/20 text-green-600">
              <Check className="size-6" />
            </span>
            <p className="text-sm font-semibold text-foreground">Sıfırlama Bağlantısı Gönderildi!</p>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{email}</span> adresine gelen e-postadaki yönergeleri takip edebilirsiniz.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-[#0f4c45] py-3 text-xs font-semibold text-white shadow-sm"
            >
              Tamam
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="E-posta adresinizi girin"
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none ring-primary/30 transition focus:ring-2"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#0f4c45] py-3.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Sıfırlama Bağlantısı Gönder
            </button>
          </form>
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}



/* ========================================================================== */
/* 🌐 Google Auth Modal (With Email Validation)                               */
/* ========================================================================== */
function GoogleAuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (name: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [customEmail, setCustomEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(customEmail)) {
      setError('Lütfen geçerli bir Google e-posta adresi giriniz.')
      return
    }
    onSuccess(customEmail.trim())
  }

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted">
            <GoogleGlyph />
          </span>
          <h3 className="font-serif text-xl font-bold">Google ile Giriş Yap</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Devam etmek için Google e-posta adresinizi girin
          </p>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-semibold text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoFocus
            value={customEmail}
            onChange={(e) => {
              setCustomEmail(e.target.value)
              setError(null)
            }}
            placeholder="ornek@gmail.com"
            className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm outline-none ring-primary/30 transition focus:ring-2"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0f4c45] py-3.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Google ile Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}

/* ========================================================================== */
/* 🍏 Apple Auth Modal (With Email Validation)                                */
/* ========================================================================== */
function AppleAuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (name: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [appleId, setAppleId] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(appleId)) {
      setError('Lütfen geçerli bir Apple ID e-postası giriniz.')
      return
    }
    onSuccess(appleId.trim())
  }

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
            <AppleGlyph />
          </span>
          <h3 className="font-serif text-xl font-bold">Sign in with Apple</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Apple ID ile hızlı ve güvenli oturum açın
          </p>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-semibold text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoFocus
            value={appleId}
            onChange={(e) => {
              setAppleId(e.target.value)
              setError(null)
            }}
            placeholder="Apple ID e-postanız (örn. ad@icloud.com)"
            className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm outline-none ring-primary/30 transition focus:ring-2"
          />

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background shadow-md transition-opacity hover:opacity-95"
          >
            <Sparkles className="size-4" />
            Apple ID ile Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}

function ConsentStep({
  consent,
  setConsent,
  onBack,
  onNext,
}: {
  consent: boolean
  setConsent: (v: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-accent text-primary">
          <ShieldCheck className="size-7" />
        </span>
        <h2 className="font-serif text-2xl font-bold">Aydınlatma Metni</h2>
        <p className="mt-1 text-sm text-muted-foreground">KVKK kapsamında onayınız</p>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
        <p className="mb-3">
          Ottoman Dict uygulaması, size daha iyi bir öğrenme deneyimi sunmak amacıyla
          tercihlerinizi (kaydedilen kelimeler, widget değişim sıklığı ve kullanım amacı)
          cihazınızda saklar.
        </p>
        <p className="mb-3">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında verileriniz
          yalnızca uygulama içi kişiselleştirme için işlenir; üçüncü kişilerle
          paylaşılmaz.
        </p>
        <p>
          Devam ederek Aydınlatma Metni’ni okuduğunuzu ve kabul ettiğinizi beyan
          etmiş olursunuz.
        </p>
      </div>

      <button
        onClick={() => setConsent(!consent)}
        className="mt-5 flex items-start gap-3 text-left"
      >
        <span
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
            consent ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card',
          )}
        >
          {consent && <Check className="size-3.5" />}
        </span>
        <span className="text-sm text-foreground">
          KVKK Aydınlatma Metni’ni okudum, kabul ediyorum.
        </span>
      </button>

      <div className="mt-auto flex gap-3 pt-8">
        <button
          onClick={onBack}
          className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:bg-accent/40"
        >
          Geri
        </button>
        <button
          disabled={!consent}
          onClick={onNext}
          className="flex-1 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        >
          Kabul et ve devam
        </button>
      </div>
    </div>
  )
}

function PreferencesStep({
  intervalHours,
  purposes,
  onInterval,
  onToggle,
  onFinish,
}: {
  intervalHours: number
  purposes: Purpose[]
  onInterval: (h: number) => void
  onToggle: (p: Purpose) => void
  onFinish: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6">
        <Wordmark className="mb-6 justify-center" />
        <h2 className="font-serif text-2xl font-bold">Tercihlerin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Widget’ını ve öğrenme akışını sana göre ayarlayalım.
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Clock className="size-4 text-primary" />
          Değişim saati adedi
        </div>
        <div className="grid grid-cols-3 gap-2">
          {intervals.map((h) => (
            <button
              key={h}
              onClick={() => onInterval(h)}
              className={cn(
                'rounded-xl border px-3 py-4 text-center transition-colors',
                intervalHours === h
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent/40',
              )}
            >
              <span className="block text-lg font-bold">{h}</span>
              <span className="text-xs">saatte bir</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <div className="mb-3 text-sm font-semibold">Ne için kullanıyorsun?</div>
        <div className="flex flex-col gap-2">
          {purposeOptions.map((o) => {
            const checked = purposes.includes(o.id)
            return (
              <button
                key={o.id}
                onClick={() => onToggle(o.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                  checked ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-accent/40',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                    checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                  )}
                >
                  {checked && <Check className="size-3.5" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{o.label}</span>
                  <span className="block text-xs text-muted-foreground">{o.desc}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="mt-auto rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground"
      >
        Başla
      </button>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.34-.17-1.96H12v3.71h5.38a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.99-4.28 2.99-7.27Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.42l-3.22-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.09v2.59A9.99 9.99 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.91a5.99 5.99 0 0 1 0-3.82V7.5H3.09a10 10 0 0 0 0 9l3.32-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.58c1.47 0 2.79.5 3.83 1.5l2.85-2.85C16.95 3.6 14.7 2.7 12 2.7A9.99 9.99 0 0 0 3.09 7.5l3.32 2.59C7.2 8.34 9.4 6.58 12 6.58Z"
      />
    </svg>
  )
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.1c.64-.78 1.08-1.85.96-2.93-.93.04-2.07.62-2.74 1.4-.6.7-1.12 1.81-.98 2.88 1.04.08 2.12-.57 2.76-1.35z" />
    </svg>
  )
}
