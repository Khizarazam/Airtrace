import { useEffect, useRef, useState } from 'react'

// Random-walk helper: keeps a value drifting smoothly within [min, max]
function walk(value, min, max, step) {
  const next = value + (Math.random() - 0.5) * step
  return Math.min(max, Math.max(min, next))
}

const MAX_POINTS = 40

const EVENT_TEMPLATES = [
  { type: 'presence', label: 'Presence confirmed — Zone A', tone: 'signal' },
  { type: 'motion', label: 'Motion spike detected', tone: 'amber' },
  { type: 'calm', label: 'Room returned to baseline', tone: 'dim' },
  { type: 'breath', label: 'Respiration lock acquired', tone: 'violet' },
  { type: 'exit', label: 'Presence lost — Zone A', tone: 'dim' },
]

export function useLiveSensing() {
  const [scenario, setScenario] = useState('vitals')
  const [connected, setConnected] = useState(false)
  const [heartRate, setHeartRate] = useState(72)
  const [respiration, setRespiration] = useState(15)
  const [rssi, setRssi] = useState(-52)
  const [motionVariance, setMotionVariance] = useState(0.12)
  const [confidence, setConfidence] = useState(91)
  const [persons, setPersons] = useState(1)
  const [presence, setPresence] = useState(true)
  const [history, setHistory] = useState(() =>
    Array.from({ length: MAX_POINTS }, (_, i) => ({
      t: i,
      hr: 72,
      resp: 15,
    }))
  )
  const [events, setEvents] = useState([])
  const tickRef = useRef(0)

  // simulate initial connection handshake
  useEffect(() => {
    const timeout = setTimeout(() => setConnected(true), 900)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!connected) return

    const interval = setInterval(() => {
      tickRef.current += 1

      setHeartRate((h) => walk(h, 58, 102, 3))
      setRespiration((r) => walk(r, 11, 20, 1))
      setRssi((r) => walk(r, -70, -38, 2))
      setMotionVariance((m) => {
        if (scenario === 'fall') return Math.min(1, walk(m, 0.6, 1, 0.3))
        if (scenario === 'empty') return Math.max(0, walk(m, 0, 0.08, 0.05))
        return Math.max(0, walk(m, 0, 1, 0.15))
      })
      setConfidence((c) => Math.min(99, Math.max(62, walk(c, 62, 99, 4))))

      if (scenario === 'empty') {
        setPersons(0)
        setPresence(false)
      } else if (scenario === 'multi') {
        setPersons((p) => Math.max(2, Math.min(4, p + (Math.random() < 0.15 ? (Math.random() > 0.5 ? 1 : -1) : 0))))
        setPresence(true)
      } else {
        setPersons(1)
        setPresence(true)
      }

      setHistory((h) => {
        const next = [...h.slice(1), { t: tickRef.current, hr: heartRateRef.current, resp: respirationRef.current }]
        return next
      })

      if (Math.random() < 0.18) {
        const tpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]
        setEvents((e) => [
          { ...tpl, id: `${Date.now()}-${Math.random()}`, time: new Date() },
          ...e.slice(0, 7),
        ])
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [connected, scenario])

  // refs so the interval closure always reads latest values without resubscribing
  const heartRateRef = useRef(heartRate)
  const respirationRef = useRef(respiration)
  useEffect(() => { heartRateRef.current = heartRate }, [heartRate])
  useEffect(() => { respirationRef.current = respiration }, [respiration])

  return {
    scenario,
    setScenario,
    connected,
    heartRate: Math.round(heartRate),
    respiration: Math.round(respiration * 10) / 10,
    rssi: Math.round(rssi),
    motionVariance,
    confidence: Math.round(confidence),
    persons,
    presence,
    history,
    events,
  }
}
