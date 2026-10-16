'use client'

import { useState } from 'react'
import type { NavigationTab } from '@/types'
import { useApp } from '@/lib/app-store'
import { OnboardingScreen } from '@/components/screens/onboarding-screen'
import { HomeScreen } from '@/components/home-screen'
import { SearchScreen } from '@/components/search-screen'
import { SavedScreen } from '@/components/saved-screen'
import { ProfileScreen } from '@/components/profile-screen'
import { BottomNav } from '@/components/bottom-nav'
import { BrandMark } from '@/components/brand'

export function AppShell() {
  const { state, ready } = useApp()
  const [tab, setTab] = useState<NavigationTab>('home')

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-background shadow-sm sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border sm:border-border overflow-hidden">
      {!ready ? (
        <div className="flex flex-1 items-center justify-center">
          <BrandMark className="size-14 animate-pulse text-2xl" />
        </div>
      ) : !state.onboarded ? (
        <div className="flex flex-1 flex-col">
          <OnboardingScreen />
        </div>
      ) : (
        <>
          <main className={`flex-1 ${tab === 'home' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
            {tab === 'home' && <HomeScreen />}
            {tab === 'search' && <SearchScreen />}
            {tab === 'saved' && <SavedScreen />}
            {tab === 'profile' && <ProfileScreen />}
          </main>
          <BottomNav active={tab} onChange={setTab} savedCount={state.savedIds.length} />
        </>
      )}
    </div>
  )
}
