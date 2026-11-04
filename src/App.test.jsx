import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App.jsx'
import { createDemoCrewRepository } from './data/demoCrewRepository.js'

const input = { name: 'Nova', role: 'pilot', specialty: 'Navigation', color: 'cyan', note: 'Our star mapper.' }

function repository() {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  return createDemoCrewRepository(storage)
}

function open(path, crewRepository) {
  window.history.pushState({}, '', path)
  render(<App repository={crewRepository} />)
}

describe('crew screens', () => {
  it('shows a useful empty gallery with a route to create', async () => {
    open('/crew', repository())
    expect(await screen.findByText(/your gallery is waiting/i)).toBeTruthy()
    expect(screen.getByRole('link', { name: /create a crewmate/i }).getAttribute('href')).toBe('/create')
  })

  it('creates a crewmate using clickable attributes and opens its detail URL', async () => {
    const crewRepository = repository()
    open('/create', crewRepository)
    fireEvent.change(await screen.findByLabelText(/crewmate name/i), { target: { value: 'Nova' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Pilot' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Navigation' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Cosmic cyan' }))
    fireEvent.click(screen.getByRole('button', { name: /create crewmate/i }))

    expect(await screen.findByRole('heading', { name: 'Nova' })).toBeTruthy()
    expect(screen.getByText('Navigation')).toBeTruthy()
    expect(window.location.pathname).toMatch(/^\/crew\/[0-9a-f-]{36}$/)
    expect((await crewRepository.list())[0].name).toBe('Nova')
  })

  it('loads a direct detail link with information beyond the gallery card', async () => {
    const crewRepository = repository()
    const created = await crewRepository.create(input)
    open(`/crew/${created.id}`, crewRepository)

    expect(await screen.findByRole('heading', { name: 'Nova' })).toBeTruthy()
    expect(screen.getByText('Our star mapper.')).toBeTruthy()
    expect(screen.getByText('Navigation')).toBeTruthy()
    expect(screen.getByRole('link', { name: /edit crewmate/i }).getAttribute('href')).toBe(`/crew/${created.id}/edit`)
  })

  it('keeps edited values on the form, updates the gallery, and deletes the record', async () => {
    const crewRepository = repository()
    const created = await crewRepository.create(input)
    open(`/crew/${created.id}/edit`, crewRepository)

    const name = await screen.findByLabelText(/crewmate name/i)
    expect(name.value).toBe('Nova')
    expect(screen.getByRole('radio', { name: 'Pilot' }).checked).toBe(true)
    fireEvent.change(name, { target: { value: 'Nova II' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Medic' }))
    expect(screen.queryByRole('radio', { name: 'Navigation' })).toBeNull()
    fireEvent.click(screen.getByRole('radio', { name: 'Field Care' }))
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/changes saved/i)).toBeTruthy()
    expect(screen.getByLabelText(/crewmate name/i).value).toBe('Nova II')
    fireEvent.click(screen.getByRole('link', { name: /gallery/i }))
    expect(await screen.findByRole('link', { name: /view nova ii/i })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: /edit nova ii/i }))
    fireEvent.click(await screen.findByRole('button', { name: /delete crewmate/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }))

    expect(await screen.findByText(/your gallery is waiting/i)).toBeTruthy()
    expect(await crewRepository.list()).toEqual([])
  })

  it('shows a missing-record state for an unknown detail URL', async () => {
    open('/crew/missing', repository())
    expect(await screen.findByText(/crewmate not found/i)).toBeTruthy()
  })

  it('shows a failed save and leaves the form values intact', async () => {
    const crewRepository = repository()
    crewRepository.create = async () => { throw new Error('Network offline') }
    open('/create', crewRepository)
    fireEvent.change(await screen.findByLabelText(/crewmate name/i), { target: { value: 'Nova' } })
    fireEvent.click(screen.getByRole('button', { name: /create crewmate/i }))

    expect(await screen.findByText(/network offline/i)).toBeTruthy()
    expect(screen.getByLabelText(/crewmate name/i).value).toBe('Nova')
  })

  it('offers a retry when the initial crew request fails', async () => {
    const crewRepository = repository()
    let tries = 0
    const actualList = crewRepository.list
    crewRepository.list = async () => {
      tries += 1
      if (tries === 1) throw new Error('Database unavailable')
      return actualList()
    }
    open('/crew', crewRepository)

    expect(await screen.findByText(/database unavailable/i)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    await waitFor(() => expect(screen.getByText(/your gallery is waiting/i)).toBeTruthy())
  })

  it('starts a new page at the top after navigation', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    try {
      open('/crew', repository())
      await screen.findByText(/your gallery is waiting/i)
      scrollTo.mockClear()
      fireEvent.click(screen.getByRole('link', { name: 'Create' }))
      await screen.findByLabelText(/crewmate name/i)
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
    } finally {
      scrollTo.mockRestore()
    }
  })

  it('clears the saved notice when the role is changed again', async () => {
    const crewRepository = repository()
    const created = await crewRepository.create(input)
    open(`/crew/${created.id}/edit`, crewRepository)
    await screen.findByLabelText(/crewmate name/i)
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(await screen.findByText(/changes saved/i)).toBeTruthy()

    fireEvent.click(screen.getByRole('radio', { name: 'Medic' }))
    expect(screen.queryByText(/changes saved/i)).toBeNull()
    expect(screen.getByRole('radio', { name: 'Field Care' }).checked).toBe(true)
  })
})
