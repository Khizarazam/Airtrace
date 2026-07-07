const SCENARIOS = [
  { id: 'empty', label: 'Empty Room' },
  { id: 'vitals', label: 'Vital Signs' },
  { id: 'multi', label: 'Multi-Person' },
  { id: 'fall', label: 'Fall Detect' },
]

export default function ScenarioBar({ active, onChange }) {
  return (
    <div className="scenario-bar">
      {SCENARIOS.map((s) => (
        <button
          key={s.id}
          className={`scenario-bar__btn ${active === s.id ? 'is-active' : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
