import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import CrewForm from '../components/CrewForm.jsx'
import { MissingCrewmate } from './DetailPage.jsx'

export default function EditPage({ member, onUpdate, onRemove }) {
  const [confirming, setConfirming] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  if (!member) return <MissingCrewmate />

  async function remove() {
    setDeleting(true)
    setDeleteError('')
    try {
      await onRemove(member.id)
      navigate('/crew')
    } catch (error) {
      setDeleteError(error.message || 'Could not delete this crewmate.')
      setDeleting(false)
    }
  }

  return <>
    <div className="detail-breadcrumb"><Link to="/crew">← Back to crew</Link><span>/</span><Link to={`/crew/${member.id}`}>{member.name}</Link><span>/</span><span>Edit</span></div>
    <div className="page-heading"><span className="eyebrow">UPDATE THE ROSTER</span><h1>Make their story <em>yours.</em></h1><p>Fine-tune {member.name}'s details. Their mission is always evolving.</p></div>
    <CrewForm initial={member} onSubmit={(value) => onUpdate(member.id, value)} saveLabel="Save changes" />
    <div className="danger-zone panel"><div><strong>Remove this crewmate</strong><p>This will take {member.name} off your roster.</p></div>{confirming ? <div className="delete-confirm"><button className="button button-danger" type="button" disabled={deleting} onClick={remove}>{deleting ? 'Deleting…' : 'Confirm delete'}</button><button className="button button-quiet" type="button" onClick={() => setConfirming(false)}>Cancel</button></div> : <button className="button button-outline-danger" type="button" onClick={() => setConfirming(true)}>Delete crewmate</button>}{deleteError && <p className="alert error" role="alert">{deleteError}</p>}</div>
  </>
}
