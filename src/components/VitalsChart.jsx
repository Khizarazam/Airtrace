import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function VitalsChart({ history, heartRate, respiration }) {
  return (
    <div className="panel vitals">
      <div className="panel__header">
        <div>
          <h3>Vital signs</h3>
          <p className="panel__sub">Contactless heart rate &amp; respiration</p>
        </div>
        <div className="vitals__readouts">
          <div className="readout">
            <span className="readout__value readout__value--signal">{heartRate}</span>
            <span className="readout__label">BPM</span>
          </div>
          <div className="readout">
            <span className="readout__value readout__value--violet">{respiration}</span>
            <span className="readout__label">RPM</span>
          </div>
        </div>
      </div>
      <div className="vitals__chart">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ED9C5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3ED9C5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="respGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8C87F7" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8C87F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              contentStyle={{
                background: '#12161E',
                border: '1px solid #1E2530',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
              }}
              labelFormatter={() => ''}
            />
            <Area type="monotone" dataKey="hr" stroke="#3ED9C5" strokeWidth={2} fill="url(#hrGradient)" isAnimationActive={false} />
            <Area type="monotone" dataKey="resp" stroke="#8C87F7" strokeWidth={2} fill="url(#respGradient)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
