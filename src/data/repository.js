import { createClient } from '@supabase/supabase-js'
import { createDemoCrewRepository } from './demoCrewRepository.js'
import { createSupabaseCrewRepository } from './supabaseCrewRepository.js'

export function isDemoMode() {
  return !import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
}

export function createAppRepository() {
  if (isDemoMode()) return createDemoCrewRepository()
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error('Supabase configuration is incomplete. Set both VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.')
  }
  let client
  try {
    client = createClient(url, key)
  } catch (error) {
    throw new Error(`Supabase configuration is invalid. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file. ${error.message}`)
  }
  return createSupabaseCrewRepository(client)
}
