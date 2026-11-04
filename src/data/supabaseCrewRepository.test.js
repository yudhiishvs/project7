import { describe, expect, it, vi } from 'vitest'
import { createSupabaseCrewRepository } from './supabaseCrewRepository.js'

const input = {
  name: 'Nova', role: 'pilot', specialty: 'Navigation', color: 'cyan', note: '',
}

function clientFixture({ session = { user: { id: 'owner-1' } }, response = { data: [], error: null } } = {}) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    single: vi.fn(async () => response),
    maybeSingle: vi.fn(async () => response),
    then: (resolve, reject) => Promise.resolve(response).then(resolve, reject),
  }
  const client = {
    auth: {
      getSession: vi.fn(async () => ({ data: { session }, error: null })),
      signInAnonymously: vi.fn(async () => ({ data: { user: { id: 'owner-1' } }, error: null })),
    },
    from: vi.fn(() => builder),
  }
  return { client, builder }
}

describe('Supabase crew repository', () => {
  it('restores a session and requests the owner’s newest records', async () => {
    const rows = [{ id: 'new', ...input, created_at: '2026-11-04T00:00:00Z' }]
    const { client, builder } = clientFixture({ response: { data: rows, error: null } })
    const repository = createSupabaseCrewRepository(client)

    expect(await repository.list()).toEqual(rows)
    expect(client.auth.signInAnonymously).not.toHaveBeenCalled()
    expect(client.from).toHaveBeenCalledWith('crewmates')
    expect(builder.eq).toHaveBeenCalledWith('user_id', 'owner-1')
    expect(builder.order).toHaveBeenNthCalledWith(1, 'created_at', { ascending: false })
    expect(builder.order).toHaveBeenNthCalledWith(2, 'id', { ascending: false })
  })

  it('signs in anonymously once when there is no session', async () => {
    const { client } = clientFixture({ session: null })
    const repository = createSupabaseCrewRepository(client)

    await Promise.all([repository.list(), repository.list()])
    expect(client.auth.signInAnonymously).toHaveBeenCalledTimes(1)
  })

  it('scopes reads and writes to the signed-in owner and record ID', async () => {
    const row = { id: 'crew-1', user_id: 'owner-1', ...input }
    const { client, builder } = clientFixture({ response: { data: row, error: null } })
    const repository = createSupabaseCrewRepository(client)

    expect(await repository.get('crew-1')).toEqual(row)
    expect(await repository.create(input)).toEqual(row)
    expect(await repository.update('crew-1', { ...input, name: 'Nova II' })).toEqual(row)
    expect(await repository.remove('crew-1')).toBe(true)
    expect(builder.insert).toHaveBeenCalledWith({ ...input, user_id: 'owner-1' })
    expect(builder.update).toHaveBeenCalledWith({ ...input, name: 'Nova II' })
    expect(builder.eq).toHaveBeenCalledWith('id', 'crew-1')
    expect(builder.eq).toHaveBeenCalledWith('user_id', 'owner-1')
  })

  it('returns null for a missing record and rejects a missing update', async () => {
    const { client } = clientFixture({ response: { data: null, error: null } })
    const repository = createSupabaseCrewRepository(client)

    expect(await repository.get('missing')).toBeNull()
    await expect(repository.update('missing', input)).rejects.toThrow(/not found/i)
    expect(await repository.remove('missing')).toBe(false)
  })

  it('surfaces auth and database failures without switching storage', async () => {
    const authFixture = clientFixture({ session: null })
    authFixture.client.auth.signInAnonymously.mockResolvedValue({ data: null, error: new Error('Enable anonymous sign-ins') })
    await expect(createSupabaseCrewRepository(authFixture.client).list()).rejects.toThrow('Enable anonymous sign-ins')

    const databaseFixture = clientFixture({ response: { data: null, error: new Error('Database unavailable') } })
    await expect(createSupabaseCrewRepository(databaseFixture.client).list()).rejects.toThrow('Database unavailable')
  })
})
