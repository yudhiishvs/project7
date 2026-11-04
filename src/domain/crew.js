export const ROLES = [
  { id: 'pilot', label: 'Pilot', description: 'Charts the way through the unknown', symbol: '✦' },
  { id: 'engineer', label: 'Engineer', description: 'Keeps every system alive', symbol: '⌘' },
  { id: 'medic', label: 'Medic', description: 'Looks after the whole crew', symbol: '✚' },
  { id: 'scout', label: 'Scout', description: 'Finds what lies ahead', symbol: '◈' },
]

export const COLORS = [
  { id: 'cyan', label: 'Cosmic cyan', hex: '#49D9EA' },
  { id: 'coral', label: 'Solar coral', hex: '#FF8E79' },
  { id: 'violet', label: 'Nebula violet', hex: '#AB9BFF' },
  { id: 'gold', label: 'Starlight gold', hex: '#F3C66B' },
]

const SPECIALTIES = {
  pilot: ['Navigation', 'Evasive Flying', 'Star Mapping'],
  engineer: ['Reactor Systems', 'Robotics', 'Repairs'],
  medic: ['Field Care', 'Xenobiology', 'Diagnostics'],
  scout: ['Recon', 'Linguistics', 'Survival'],
}

export function specialtiesFor(role) {
  return SPECIALTIES[role] ?? []
}

export function validateCrew(input = {}) {
  const value = {
    name: typeof input.name === 'string' ? input.name.trim() : '',
    role: input.role,
    specialty: input.specialty,
    color: input.color,
    note: typeof input.note === 'string' ? input.note.trim() : '',
  }
  const errors = {}

  if (!value.name || value.name.length > 32) {
    errors.name = 'Enter a name with 1 to 32 characters.'
  }
  if (!ROLES.some((role) => role.id === value.role)) {
    errors.role = 'Choose a role.'
  }
  if (!specialtiesFor(value.role).includes(value.specialty)) {
    errors.specialty = 'Choose a specialty for this role.'
  }
  if (!COLORS.some((color) => color.id === value.color)) {
    errors.color = 'Choose a suit color.'
  }
  if (value.note.length > 160) {
    errors.note = 'Keep the note to 160 characters or fewer.'
  }

  return { ok: Object.keys(errors).length === 0, value, errors }
}

export function crewInputOrThrow(input) {
  const result = validateCrew(input)
  if (!result.ok) {
    const [field, message] = Object.entries(result.errors)[0]
    throw new Error(`${field}: ${message}`)
  }
  return result.value
}

export function sortCrew(rows) {
  return [...rows].sort((a, b) => {
    const byDate = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return byDate || b.id.localeCompare(a.id)
  })
}

export function crewStats(rows) {
  const roleCounts = Object.fromEntries(ROLES.map((role) => [role.id, 0]))
  for (const row of rows) {
    if (row.role in roleCounts) roleCounts[row.role] += 1
  }
  const diversity = Object.values(roleCounts).filter(Boolean).length
  return {
    count: rows.length,
    roleCounts,
    diversity,
    readiness: Math.min(60, rows.length * 15) + diversity * 10,
  }
}
