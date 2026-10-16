import { AppProvider } from '@/lib/app-store'
import { AppShell } from '@/components/app-shell'

export default function Page() {
  return (
    <AppProvider>
      <div className="min-h-dvh bg-gradient-to-b from-muted/40 to-background sm:bg-none">
        <AppShell />
      </div>
    </AppProvider>
  )
}
