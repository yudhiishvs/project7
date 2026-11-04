import { Link } from 'react-router'
import CrewmateAvatar from '../components/CrewmateAvatar.jsx'
import { COLORS, ROLES } from '../domain/crew.js'

export function MissingCrewmate() {
  return <div className="missing-state panel"><span className="missing-symbol">✧</span><span className="eyebrow">LOST IN SPACE</span><h1>Crewmate not found.</h1><p>This explorer may have left the crew, or the link may be incomplete.</p><Link className="button button-primary" to="/crew">Back to gallery <span aria-hidden="true">→</span></Link></div>
}

export default function DetailPage({ member }) {
  if (!member) return <MissingCrewmate />
  const role = ROLES.find((item) => item.id === member.role)
  const color = COLORS.find((item) => item.id === member.color)
  const joined = new Date(member.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  return <>
    <div className="detail-breadcrumb"><Link to="/crew">← Back to crew</Link><span>/</span><span>{member.name}</span></div>
    <div className="detail-layout">
      <div className="detail-profile panel"><span className="eyebrow">CREW PROFILE</span><div className="detail-art"><div className="detail-orbit" /><CrewmateAvatar color={member.color} className="avatar-detail" /></div><div className="detail-profile-bottom"><span className="signal-dot" /> ACTIVE CREWMATE <span>✦</span></div></div>
      <div className="detail-content"><span className="eyebrow">MEET THE EXPLORER</span><h1>{member.name}</h1><p className="detail-role">{role?.symbol} {role?.label ?? member.role} <span>·</span> {member.specialty}</p><div className="detail-quote panel"><span>“</span><p>{member.note || 'Every great mission has a story waiting to be written.'}</p></div><div className="detail-facts"><div><span>ROLE</span><strong>{role?.label ?? member.role}</strong></div><div><span>SPECIALTY</span><strong>{member.specialty}</strong></div><div><span>SUIT COLOR</span><strong><i className="fact-dot" style={{ background: color?.hex }} />{color?.label ?? member.color}</strong></div><div><span>JOINED THE CREW</span><strong>{joined}</strong></div></div><Link className="button button-primary" to={`/crew/${member.id}/edit`}>Edit crewmate <span aria-hidden="true">↗</span></Link></div>
    </div>
  </>
}
