
'use client'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabaseBrowser()}>
      {children}
    </SessionContextProvider>
  )
}
