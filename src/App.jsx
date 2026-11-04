import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router'
import Shell from './components/Shell.jsx'
import { sortCrew } from './domain/crew.js'
import { createAppRepository, isSupabaseConfigured } from './data/repository.js'
import HomePage from './pages/HomePage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import DetailPage, { MissingCrewmate } from './pages/DetailPage.jsx'
import EditPage from './pages/EditPage.jsx'

function CrewRoute({ crew, edit, onUpdate, onRemove }) {
  const { id } = useParams()
  const member = crew.find((row) => row.id === id)
  return edit
    ? <EditPage member={member} onUpdate={onUpdate} onRemove={onRemove} />
    : <DetailPage member={member} />
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export default function App({ repository }) {
  const [crewRepository] = useState(() => repository ?? createAppRepository())
  const [crew, setCrew] = useState([])
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setLoadError('')
    try {
      setCrew(sortCrew(await crewRepository.list()))
      setStatus('ready')
    } catch (error) {
      setLoadError(error.message || 'Could not load your crew.')
      setStatus('error')
    }
  }, [crewRepository])

  useEffect(() => { load() }, [load])

  async function create(input) {
    const row = await crewRepository.create(input)
    setCrew((current) => sortCrew([...current, row]))
    return row
  }

  async function update(id, input) {
    const row = await crewRepository.update(id, input)
    setCrew((current) => sortCrew(current.map((member) => member.id === id ? row : member)))
    return row
  }

  async function remove(id) {
    if (!await crewRepository.remove(id)) throw new Error('Crewmate not found.')
    setCrew((current) => current.filter((member) => member.id !== id))
  }

  return <BrowserRouter><ScrollToTop /><Shell demo={!isSupabaseConfigured()}>
    {!isSupabaseConfigured() && <div className="demo-banner"><span className="signal-dot" /><strong>Demo mode</strong><span>Your crew is saved in this browser. Add Supabase settings to use the cloud database.</span></div>}
    {status === 'loading' ? <div className="loading-state" role="status"><span className="loading-orbit">✦</span><p>Connecting to mission control…</p></div>
      : status === 'error' ? <div className="missing-state panel"><span className="missing-symbol">!</span><span className="eyebrow">CONNECTION TROUBLE</span><h1>Unable to load crew.</h1><p>{loadError}</p><button className="button button-primary" type="button" onClick={load}>Try again <span aria-hidden="true">↻</span></button></div>
        : <Routes>
          <Route path="/" element={<HomePage count={crew.length} />} />
          <Route path="/create" element={<CreatePage onCreate={create} />} />
          <Route path="/crew" element={<GalleryPage crew={crew} />} />
          <Route path="/crew/:id" element={<CrewRoute crew={crew} />} />
          <Route path="/crew/:id/edit" element={<CrewRoute crew={crew} edit onUpdate={update} onRemove={remove} />} />
          <Route path="*" element={<MissingCrewmate />} />
        </Routes>}
  </Shell></BrowserRouter>
}
