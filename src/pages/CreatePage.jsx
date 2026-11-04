import { useNavigate } from 'react-router'
import CrewForm from '../components/CrewForm.jsx'

export default function CreatePage({ onCreate }) {
  const navigate = useNavigate()
  return (
    <>
      <div className="page-heading"><span className="eyebrow">THE TEAM IS GROWING</span><h1>Meet your new <em>crewmate.</em></h1><p>Give them a name, choose their strengths, and make them your own.</p></div>
      <CrewForm onSubmit={onCreate} onSaved={(row) => navigate(`/crew/${row.id}`)} saveLabel="Create crewmate" />
    </>
  )
}
