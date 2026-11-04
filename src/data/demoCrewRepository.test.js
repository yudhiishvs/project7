import { describe, expect, it } from 'vitest'
import { createDemoCrewRepository } from './demoCrewRepository.js'

const input = {
  name: 'Nova',
  role: 'pilot',
  specialty: 'Navigation',
  color: 'cyan',
  note: 'First through the stars.',
}

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}

describe('demo crew repository', () => {
  it('creates and persists records across repository instances', async () => {
    const storage = memoryStorage()
    const repository = createDemoCrewRepository(storage)
    const created = await repository.create(input)

    expect(created).toMatchObject(input)
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(created.created_at).toBeTruthy()
    expect(await createDemoCrewRepository(storage).get(created.id)).toMatchObject(input)
  })

  it('updates the selected record and preserves its creation time', async () => {
    const repository = createDemoCrewRepository(memoryStorage())
    const created = await repository.create(input)
    const updated = await repository.update(created.id, {
      ...input,
      name: 'Nova II',
      role: 'medic',
      specialty: 'Field Care',
    })

    expect(updated).toMatchObject({ name: 'Nova II', role: 'medic', specialty: 'Field Care' })
    expect(updated.created_at).toBe(created.created_at)
    expect((await repository.list())[0].name).toBe('Nova II')
  })

  it('deletes only the selected record', async () => {
    const repository = createDemoCrewRepository(memoryStorage())
    const first = await repository.create(input)
    const second = await repository.create({ ...input, name: 'Vega' })

    expect(await repository.remove(first.id)).toBe(true)
    expect(await repository.get(first.id)).toBeNull()
    expect(await repository.get(second.id)).toMatchObject({ name: 'Vega' })
    expect(await repository.remove(first.id)).toBe(false)
  })

  it('treats damaged browser storage as an empty crew', async () => {
    const storage = memoryStorage({ 'orbit-crew-demo-v1': '{broken' })
    const repository = createDemoCrewRepository(storage)

    expect(await repository.list()).toEqual([])
    expect(await repository.get('missing')).toBeNull()
    expect((await repository.create(input)).name).toBe('Nova')
    expect(await repository.list()).toHaveLength(1)
  })

  it('drops structurally invalid saved records before rendering or editing', async () => {
    const stored = [
      { id: 'broken', name: null, note: null },
      { id: 'wrong-role', ...input, role: 'captain', created_at: '2026-11-04T00:00:00.000Z', updated_at: '2026-11-04T00:00:00.000Z' },
      { id: 'bad-date', ...input, created_at: 'yesterday', updated_at: '2026-11-04T00:00:00.000Z' },
    ]
    const storage = memoryStorage({ 'orbit-crew-demo-v1': JSON.stringify(stored) })
    const repository = createDemoCrewRepository(storage)

    expect(await repository.list()).toEqual([])
    expect(await repository.get('broken')).toBeNull()
    expect((await repository.create(input)).name).toBe('Nova')
    expect(await repository.list()).toHaveLength(1)
  })

  it('rejects invalid saves and unknown edit targets', async () => {
    const repository = createDemoCrewRepository(memoryStorage())
    await expect(repository.create({ ...input, name: ' ' })).rejects.toThrow(/name/i)
    await expect(repository.update('missing', input)).rejects.toThrow(/not found/i)
  })
})
