import { createClient } from '@supabase/supabase-js'
import { createDemoCrewRepository } from './demoCrewRepository.js'
import { createSupabaseCrewRepository } from './supabaseCrewRepository.js'

export function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
}

export function createAppRepository() {
  if (!isSupabaseConfigured()) return createDemoCrewRepository()
  const client = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
  return createSupabaseCrewRepository(client)
}
