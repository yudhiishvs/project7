import { COLORS } from '../domain/crew.js'

export default function CrewmateAvatar({ color = 'cyan', className = '' }) {
  const suit = COLORS.find((item) => item.id === color)?.hex ?? COLORS[0].hex

  return (
    <div className={`avatar ${className}`} style={{ '--suit': suit }} aria-hidden="true">
      <svg viewBox="0 0 220 240" role="img" focusable="false">
        <defs>
          <linearGradient id={`helmet-${color}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8FCBDE" />
            <stop offset=".55" stopColor="#244C6C" />
            <stop offset="1" stopColor="#112E4D" />
          </linearGradient>
          <linearGradient id={`suit-${color}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={suit} />
            <stop offset="1" stopColor="#305577" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r="96" fill="rgba(113,203,218,.09)" />
        <circle cx="110" cy="110" r="78" fill="none" stroke="rgba(134,224,233,.15)" strokeWidth="1" />
        <path d="M24 222c3-47 37-73 86-73s83 26 86 73" fill={`url(#suit-${color})`} stroke="#B6EBF0" strokeWidth="4" />
        <path d="M43 215c2-30 12-43 32-52l17 29h36l17-29c20 9 30 22 32 52" fill="rgba(8,26,46,.34)" />
        <rect x="92" y="174" width="36" height="28" rx="7" fill="#102A43" stroke="#A4DEE5" strokeWidth="3" />
        <circle cx="110" cy="102" r="67" fill="#DCECF1" />
        <circle cx="110" cy="102" r="58" fill={`url(#helmet-${color})`} stroke="#93C7D6" strokeWidth="3" />
        <path d="M68 83c9-23 26-37 51-39" fill="none" stroke="rgba(255,255,255,.43)" strokeWidth="7" strokeLinecap="round" />
        <path d="M82 127c17 11 39 11 56 0" fill="none" stroke="rgba(135,228,236,.5)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="91" cy="104" r="4" fill="#D7F7F3" />
        <circle cx="129" cy="104" r="4" fill="#D7F7F3" />
        <path d="M94 120q16 12 32 0" fill="none" stroke="#D7F7F3" strokeWidth="3" strokeLinecap="round" />
        <circle cx="35" cy="56" r="3" fill="#CFF7EF" />
        <circle cx="181" cy="48" r="2" fill="#CFF7EF" />
        <path d="M179 156h13m-6-6v13" stroke="#D4FFF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
