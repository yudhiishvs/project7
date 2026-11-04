import { describe, expect, it } from 'vitest'
import { crewStats, sortCrew, specialtiesFor, validateCrew } from './crew.js'

const pilot = {
  name: '  Nova  ',
  role: 'pilot',
  specialty: 'Navigation',
  color: 'cyan',
  note: '  Keeps us on course.  ',
}

describe('crew rules', () => {
  it('rejects blank names before a crewmate is saved', () => {
    const result = validateCrew({ ...pilot, name: '   ' })
    expect(result.ok).toBe(false)
    expect(result.errors.name).toBeTruthy()
  })

  it('keeps a specialty within the selected role', () => {
    expect(specialtiesFor('medic')).toContain('Field Care')
    expect(specialtiesFor('medic')).not.toContain('Navigation')
    const result = validateCrew({ ...pilot, role: 'medic' })
    expect(result.ok).toBe(false)
    expect(result.errors.specialty).toBeTruthy()
  })

  it('trims editable text and enforces its limits', () => {
    expect(validateCrew(pilot)).toEqual({
      ok: true,
      value: { ...pilot, name: 'Nova', note: 'Keeps us on course.' },
      errors: {},
    })
    expect(validateCrew({ ...pilot, name: 'x'.repeat(33) }).errors.name).toBeTruthy()
    expect(validateCrew({ ...pilot, note: 'x'.repeat(161) }).errors.note).toBeTruthy()
  })

  it('sorts newest first without mutating the input', () => {
    const rows = [
      { id: 'a', created_at: '2026-11-01T00:00:00Z' },
      { id: 'b', created_at: '2026-11-02T00:00:00Z' },
      { id: 'c', created_at: '2026-11-02T00:00:00Z' },
    ]
    expect(sortCrew(rows).map((row) => row.id)).toEqual(['c', 'b', 'a'])
    expect(rows.map((row) => row.id)).toEqual(['a', 'b', 'c'])
  })

  it('calculates readiness from crew size and role diversity', () => {
    expect(crewStats([])).toMatchObject({ count: 0, readiness: 0 })
    expect(crewStats([{ role: 'pilot' }])).toMatchObject({ count: 1, readiness: 25 })
    expect(crewStats([
      { role: 'pilot' },
      { role: 'engineer' },
      { role: 'medic' },
      { role: 'scout' },
    ])).toMatchObject({ count: 4, readiness: 100, diversity: 4 })
  })
})
