import { Link } from 'react-router'
import CrewmateAvatar from '../components/CrewmateAvatar.jsx'
import { ROLES } from '../domain/crew.js'

export default function HomePage({ count }) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> A NEW MISSION AWAITS</span>
          <h1>Every great mission starts with a <em>crew.</em></h1>
          <p>Meet the explorers who make the impossible possible. Create your own crewmates, give them a role, and build a team ready for anything the universe sends their way.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/create">Create a crewmate <span aria-hidden="true">↗</span></Link>
            <Link className="button button-quiet" to="/crew">Explore your gallery <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-proof"><span className="proof-stars">✦ ✦ ✦</span><span>{count ? `${count} explorer${count === 1 ? '' : 's'} in your crew` : 'A whole universe to explore'}</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-planet" />
          <span className="hero-star star-a">✦</span><span className="hero-star star-b">✦</span><span className="hero-star star-c">✧</span>
          <div className="hero-avatar hero-avatar-one"><CrewmateAvatar color="cyan" /></div>
          <div className="hero-avatar hero-avatar-two"><CrewmateAvatar color="coral" /></div>
          <div className="hero-avatar hero-avatar-three"><CrewmateAvatar color="violet" /></div>
          <div className="hero-mission-card"><span className="signal-dot" /><span>MISSION STATUS</span><strong>Ready for launch</strong></div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="roles-heading">
        <div className="section-heading"><div><span className="eyebrow">THE POSSIBILITIES</span><h2 id="roles-heading">Find your place in the stars.</h2></div><p>Every mission needs a mix of minds. Pick a path and make it yours.</p></div>
        <div className="home-roles">
          {ROLES.map((role, index) => <div className="home-role panel" key={role.id}>
            <span className="home-role-index">0{index + 1}</span><span className="home-role-symbol">{role.symbol}</span>
            <h3>{role.label}</h3><p>{role.description}.</p>
          </div>)}
        </div>
      </section>

      <section className="home-cta panel"><div><span className="eyebrow">YOUR STORY STARTS HERE</span><h2>Who will you bring aboard?</h2><p>The best crews are the ones you build yourself.</p></div><Link className="button button-primary" to="/create">Build your crew <span aria-hidden="true">↗</span></Link></section>
    </>
  )
}
