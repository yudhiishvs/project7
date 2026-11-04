import { crewInputOrThrow } from '../domain/crew.js'

export function createSupabaseCrewRepository(client) {
  let sessionPromise

  async function ensureSession() {
    if (!sessionPromise) {
      sessionPromise = (async () => {
        const { data: existing, error: sessionError } = await client.auth.getSession()
        if (sessionError) throw sessionError
        if (existing?.session?.user?.id) return existing.session.user

        const { data: signedIn, error: signInError } = await client.auth.signInAnonymously()
        if (signInError) throw signInError
        const user = signedIn?.user ?? signedIn?.session?.user
        if (!user?.id) throw new Error('Anonymous sign-in did not return a user.')
        return user
      })()
    }
    try {
      return await sessionPromise
    } catch (error) {
      sessionPromise = undefined
      throw error
    }
  }

  function dataOrThrow(result) {
    if (result.error) throw result.error
    return result.data
  }

  return {
    ensureSession,
    async list() {
      const user = await ensureSession()
      const result = await client.from('crewmates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
      return dataOrThrow(result) ?? []
    },
    async get(id) {
      const user = await ensureSession()
      const result = await client.from('crewmates')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle()
      return dataOrThrow(result) ?? null
    },
    async create(input) {
      const value = crewInputOrThrow(input)
      const user = await ensureSession()
      const result = await client.from('crewmates')
        .insert({ ...value, user_id: user.id })
        .select('*')
        .single()
      return dataOrThrow(result)
    },
    async update(id, input) {
      const value = crewInputOrThrow(input)
      const user = await ensureSession()
      const result = await client.from('crewmates')
        .update(value)
        .eq('id', id)
        .eq('user_id', user.id)
        .select('*')
        .maybeSingle()
      const row = dataOrThrow(result)
      if (!row) throw new Error('Crewmate not found.')
      return row
    },
    async remove(id) {
      const user = await ensureSession()
      const result = await client.from('crewmates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .select('id')
        .maybeSingle()
      return Boolean(dataOrThrow(result))
    },
  }
}
