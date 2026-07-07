function signalBars(rssi) {
  // rssi ranges roughly -70 (weak) to -38 (strong)
  const pct = Math.min(1, Math.max(0, (rssi + 70) / 32))
  return Math.round(pct * 4) + 1
}

export default function StatsGrid({ rssi, motionVariance, confidence, presence }) {
  const bars = signalBars(rssi)
  return (
    <div className="stats-grid">
      <div className="panel stat">
        <p className="stat__label">Signal strength</p>
        <div className="stat__row">
          <span className="stat__value">{rssi}</span>
          <span className="stat__unit">dBm</span>
        </div>
        <div className="signal-bars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`signal-bars__bar ${i <= bars ? 'is-active' : ''}`} style={{ height: `${i * 4 + 6}px` }} />
          ))}
        </div>
      </div>

      <div className="panel stat">
        <p className="stat__label">Motion variance</p>
        <div className="stat__row">
          <span className="stat__value">{motionVariance.toFixed(2)}</span>
        </div>
        <div className="bar-track">
          <div className="bar-track__fill" style={{ width: `${motionVariance * 100}%` }} />
        </div>
      </div>

      <div className="panel stat">
        <p className="stat__label">Model confidence</p>
        <div className="stat__row">
          <span className="stat__value">{confidence}</span>
          <span className="stat__unit">%</span>
        </div>
        <div className="bar-track">
          <div className="bar-track__fill bar-track__fill--amber" style={{ width: `${confidence}%` }} />
        </div>
      </div>

      <div className="panel stat">
        <p className="stat__label">Presence</p>
        <div className="stat__row">
          <span className={`presence-dot ${presence ? 'is-on' : ''}`} />
          <span className="stat__value stat__value--small">{presence ? 'Detected' : 'Empty room'}</span>
        </div>
      </div>
    </div>
  )
}
