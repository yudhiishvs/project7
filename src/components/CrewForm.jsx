import { useEffect, useState } from 'react'
import CrewmateAvatar from './CrewmateAvatar.jsx'
import { COLORS, ROLES, specialtiesFor, validateCrew } from '../domain/crew.js'

const BLANK = { name: '', role: 'pilot', specialty: 'Navigation', color: 'cyan', note: '' }

export default function CrewForm({ initial, onSubmit, onSaved, saveLabel }) {
  const [form, setForm] = useState(() => initial ? { ...BLANK, ...initial } : BLANK)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setForm(initial ? { ...BLANK, ...initial } : BLANK)
    setSaved(false)
    setErrors({})
    setRequestError('')
  }, [initial?.id])

  function change(field, value) {
    setSaved(false)
    setRequestError('')
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  function changeRole(role) {
    setSaved(false)
    setRequestError('')
    setErrors((previous) => ({ ...previous, role: undefined, specialty: undefined }))
    setForm((previous) => ({ ...previous, role, specialty: specialtiesFor(role)[0] }))
  }

  async function submit(event) {
    event.preventDefault()
    const result = validateCrew(form)
    setErrors(result.errors)
    if (!result.ok) return
    setBusy(true)
    setRequestError('')
    try {
      const row = await onSubmit(result.value)
      setForm({ ...BLANK, ...row })
      setSaved(true)
      onSaved?.(row)
    } catch (error) {
      setRequestError(error.message || 'Could not save this crewmate.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="form-layout">
      <form className="crew-form panel" onSubmit={submit} noValidate>
        <div className="section-label"><span>01</span> IDENTITY</div>
        <label className="field-label" htmlFor="crew-name">Crewmate name <span>*</span></label>
        <input id="crew-name" className={`text-input ${errors.name ? 'invalid' : ''}`} value={form.name} onChange={(event) => change('name', event.target.value)} placeholder="e.g. Nova Stardust" maxLength="32" autoComplete="off" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
        <p className="field-help">Every legend needs a name.</p>

        <fieldset className="option-section">
          <legend className="section-label"><span>02</span> YOUR ROLE</legend>
          <p className="section-help">What will they bring to the mission?</p>
          <div className="role-options">
            {ROLES.map((role) => <label className={`role-option ${form.role === role.id ? 'selected' : ''}`} key={role.id}>
              <input type="radio" name="role" value={role.id} aria-label={role.label} checked={form.role === role.id} onChange={() => changeRole(role.id)} />
              <span className="role-icon" aria-hidden="true">{role.symbol}</span>
              <span><strong>{role.label}</strong><small>{role.description}</small></span>
              <span className="option-check" aria-hidden="true">✓</span>
            </label>)}
          </div>
          {errors.role && <p className="field-error">{errors.role}</p>}
        </fieldset>

        <fieldset className="option-section">
          <legend className="section-label"><span>03</span> SPECIALTY</legend>
          <p className="section-help">Choose a focus for this role.</p>
          <div className="specialty-options">
            {specialtiesFor(form.role).map((specialty) => <label className={`chip-option ${form.specialty === specialty ? 'selected' : ''}`} key={specialty}>
              <input type="radio" name="specialty" value={specialty} aria-label={specialty} checked={form.specialty === specialty} onChange={() => change('specialty', specialty)} />
              {specialty}
            </label>)}
          </div>
          {errors.specialty && <p className="field-error">{errors.specialty}</p>}
        </fieldset>

        <fieldset className="option-section">
          <legend className="section-label"><span>04</span> SUIT COLOR</legend>
          <p className="section-help">Pick a color that stands out in the stars.</p>
          <div className="color-options">
            {COLORS.map((color) => <label className={`color-option ${form.color === color.id ? 'selected' : ''}`} key={color.id}>
              <input type="radio" name="color" value={color.id} aria-label={color.label} checked={form.color === color.id} onChange={() => change('color', color.id)} />
              <span className="color-swatch" style={{ background: color.hex }} />
              <span>{color.label}</span>
              <span className="option-check" aria-hidden="true">✓</span>
            </label>)}
          </div>
          {errors.color && <p className="field-error">{errors.color}</p>}
        </fieldset>

        <div className="option-section">
          <div className="section-label"><span>05</span> MISSION NOTE</div>
          <label className="field-label" htmlFor="crew-note">A little about them <em>(optional)</em></label>
          <textarea id="crew-note" className={`text-input text-area ${errors.note ? 'invalid' : ''}`} value={form.note} onChange={(event) => change('note', event.target.value)} maxLength="160" placeholder="What makes this crewmate one of a kind?" />
          <p className="field-help char-count">{form.note.length}/160 characters</p>
          {errors.note && <p className="field-error">{errors.note}</p>}
        </div>

        {requestError && <p className="alert error" role="alert">{requestError}</p>}
        {saved && <p className="alert success" role="status">Changes saved. Your crewmate is ready for the next mission.</p>}
        <button className="button button-primary form-submit" type="submit" disabled={busy}>{busy ? 'Saving…' : saveLabel}<span aria-hidden="true">↗</span></button>
      </form>

      <aside className="preview-column">
        <div className="preview-card panel">
          <div className="preview-top"><span className="eyebrow">LIVE PREVIEW</span><span className="preview-number">#{initial?.id?.slice(0, 4).toUpperCase() || '0001'}</span></div>
          <div className="preview-art"><span className="preview-orbit" /><CrewmateAvatar color={form.color} className="avatar-preview" /></div>
          <span className="preview-status"><span className="signal-dot" /> READY FOR DUTY</span>
          <h2>{form.name.trim() || 'Your crewmate'}</h2>
          <p>{ROLES.find((role) => role.id === form.role)?.label} <span aria-hidden="true">·</span> {form.specialty}</p>
          <div className="preview-bottom"><span>ORBIT CREW</span><span>✦</span></div>
        </div>
        <p className="preview-caption">Your crew, your mission. Every choice makes your team unique.</p>
      </aside>
    </div>
  )
}
