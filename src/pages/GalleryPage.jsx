import { Link } from 'react-router'
import CrewmateAvatar from '../components/CrewmateAvatar.jsx'
import { crewStats, ROLES } from '../domain/crew.js'

export default function GalleryPage({ crew }) {
  const stats = crewStats(crew)
  return (
    <>
      <div className="page-heading gallery-heading"><div><span className="eyebrow">YOUR PEOPLE, YOUR MISSION</span><h1>The crew <em>gallery.</em></h1><p>Every explorer has a story. Here are the ones you have brought aboard.</p></div><Link className="button button-primary" to="/create">Add a crewmate <span aria-hidden="true">＋</span></Link></div>

      <div className="gallery-stats">
        <div className="stat-card panel"><span className="eyebrow">CREWMATES</span><strong>{String(stats.count).padStart(2, '0')}</strong><span>on your roster</span></div>
        <div className="stat-card panel"><span className="eyebrow">ROLES COVERED</span><strong>{stats.diversity}<small> / 4</small></strong><span>unique talents</span></div>
        <div className="readiness-card panel"><div><span className="eyebrow">MISSION READINESS</span><strong>{stats.readiness}%</strong><span>{stats.readiness === 100 ? 'Your crew is ready for anything.' : 'Add members and more roles to grow your score.'}</span></div><div className="readiness-ring" style={{ '--readiness': `${stats.readiness}%` }}><span>✦</span></div></div>
      </div>

      <div className="role-breakdown panel"><span className="eyebrow">CREW COMPOSITION</span><div className="breakdown-items">{ROLES.map((role) => <div key={role.id}><span className="breakdown-icon">{role.symbol}</span><span>{role.label}</span><strong>{stats.roleCounts[role.id]}</strong></div>)}</div></div>

      <div className="gallery-section-heading"><div><span className="eyebrow">THE ROSTER</span><h2>{crew.length ? 'Your explorers' : 'Ready when you are'}</h2></div><span className="sort-label">NEWEST FIRST ↓</span></div>
      {crew.length === 0 ? (
        <div className="empty-state panel"><div className="empty-illustration" aria-hidden="true"><span>✦</span><span>◌</span></div><h3>Your gallery is waiting.</h3><p>No crewmates yet. Bring your first explorer aboard and start your story.</p><Link className="button button-primary" to="/create">Create a crewmate <span aria-hidden="true">↗</span></Link></div>
      ) : (
        <div className="crew-grid">{crew.map((member, index) => {
          const role = ROLES.find((item) => item.id === member.role)
          return <article className="crew-card panel" key={member.id}>
            <div className="crew-card-top"><span className="crew-card-index">CREW #{String(index + 1).padStart(2, '0')}</span><span className="crew-card-status"><span className="signal-dot" /> ACTIVE</span></div>
            <Link className="crew-card-main" to={`/crew/${member.id}`} aria-label={`View ${member.name}`}><CrewmateAvatar color={member.color} className="avatar-card" /><h3>{member.name}</h3><p>{role?.label ?? member.role}</p></Link>
            <div className="crew-card-bottom"><span>{role?.symbol} {member.specialty}</span><Link to={`/crew/${member.id}/edit`} aria-label={`Edit ${member.name}`}>Edit <span aria-hidden="true">↗</span></Link></div>
          </article>
        })}</div>
      )}
    </>
  )
}
