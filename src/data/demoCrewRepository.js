import { crewInputOrThrow, sortCrew, validateCrew } from '../domain/crew.js'

const STORAGE_KEY = 'orbit-crew-demo-v1'

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function isStoredCrewmate(row) {
  return row && typeof row === 'object' && !Array.isArray(row)
    && typeof row.id === 'string' && row.id.length > 0
    && typeof row.name === 'string' && typeof row.note === 'string'
    && typeof row.created_at === 'string' && Number.isFinite(Date.parse(row.created_at))
    && typeof row.updated_at === 'string' && Number.isFinite(Date.parse(row.updated_at))
    && validateCrew(row).ok
}

export function createDemoCrewRepository(storage = globalThis.localStorage) {
  function read() {
    try {
      const rows = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]')
      return Array.isArray(rows) ? rows.filter(isStoredCrewmate) : []
    } catch {
      return []
    }
  }

  function write(rows) {
    storage.setItem(STORAGE_KEY, JSON.stringify(rows))
  }

  return {
    async list() {
      return sortCrew(read())
    },
    async get(id) {
      return read().find((row) => row.id === id) ?? null
    },
    async create(input) {
      const value = crewInputOrThrow(input)
      const timestamp = new Date().toISOString()
      const row = { id: makeId(), ...value, created_at: timestamp, updated_at: timestamp }
      write([...read(), row])
      return row
    },
    async update(id, input) {
      const value = crewInputOrThrow(input)
      const rows = read()
      const index = rows.findIndex((row) => row.id === id)
      if (index < 0) throw new Error('Crewmate not found.')
      const row = { ...rows[index], ...value, updated_at: new Date().toISOString() }
      rows[index] = row
      write(rows)
      return row
    },
    async remove(id) {
      const rows = read()
      const remaining = rows.filter((row) => row.id !== id)
      if (remaining.length === rows.length) return false
      write(remaining)
      return true
    },
  }
}
