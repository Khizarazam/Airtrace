import './RadarSweep.css'

export default function RadarSweep({ presence, persons, connected }) {
  // Fixed pseudo-random blip positions around the radar, shown only when presence is true
  const blips = [
    { angle: 40, dist: 0.55 },
    { angle: 190, dist: 0.7 },
    { angle: 290, dist: 0.4 },
  ].slice(0, persons)

  return (
    <div className="radar">
      <div className={`radar__ring radar__ring--1 ${connected ? 'is-live' : ''}`} />
      <div className={`radar__ring radar__ring--2 ${connected ? 'is-live' : ''}`} />
      <div className={`radar__ring radar__ring--3 ${connected ? 'is-live' : ''}`} />
      <div className="radar__crosshair radar__crosshair--h" />
      <div className="radar__crosshair radar__crosshair--v" />

      {connected && <div className="radar__sweep" />}

      {connected && presence && blips.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180
        const x = 50 + Math.cos(rad) * b.dist * 46
        const y = 50 + Math.sin(rad) * b.dist * 46
        return (
          <div
            key={i}
            className="radar__blip"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}
          />
        )
      })}

      <div className="radar__center">
        <span className="radar__count">{connected ? persons : '—'}</span>
        <span className="radar__count-label">{persons === 1 ? 'person' : 'people'}</span>
      </div>
    </div>
  )
}
