
'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

/** Supabase client for client‑side components (hooks, etc).  */
export const supabaseBrowser = () => createClientComponentClient()
