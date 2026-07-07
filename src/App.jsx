import { useEffect, useState } from 'react'
import { useLiveSensing } from './hooks/useLiveSensing'
import RadarSweep from './components/RadarSweep'
import PoseViz from './components/PoseViz'
import ScenarioBar from './components/ScenarioBar'
import VitalsChart from './components/VitalsChart'
import StatsGrid from './components/StatsGrid'
import EventLog from './components/EventLog'
import './App.css'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function App() {
  const data = useLiveSensing()
  const now = useClock()

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__mark" />
          <div>
            <h1>AirTrace</h1>
            <p>Live WiFi sensing observatory</p>
          </div>
        </div>
        <div className="header__status">
          <div className={`status-pill ${data.connected ? 'is-live' : ''}`}>
            <span className="status-pill__dot" />
            {data.connected ? 'Node online' : 'Connecting…'}
          </div>
          <span className="header__clock">
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </header>

      <main className="layout">
        <section className="layout__radar">
          <div className="panel panel--radar">
            <div className="panel__header">
              <div>
                <h3>Room scan</h3>
                <p className="panel__sub">Zone A · ESP32-CSI node #01</p>
              </div>
            </div>
            <RadarSweep presence={data.presence} persons={data.persons} connected={data.connected} />
          </div>
        </section>

        <section className="layout__main">
          <div className="panel">
            <div className="panel__header">
              <div>
                <h3>Pose fusion</h3>
                <p className="panel__sub">Wireframe reconstruction from CSI · 60 FPS</p>
              </div>
            </div>
            <ScenarioBar active={data.scenario} onChange={data.setScenario} />
            <PoseViz scenario={data.scenario} persons={data.persons} />
          </div>
          <VitalsChart history={data.history} heartRate={data.heartRate} respiration={data.respiration} />
          <StatsGrid
            rssi={data.rssi}
            motionVariance={data.motionVariance}
            confidence={data.confidence}
            presence={data.presence}
          />
        </section>

        <section className="layout__log">
          <EventLog events={data.events} />
        </section>
      </main>

      <footer className="footer">
        <span>No cameras. No wearables. All data generated locally on-device.</span>
        <span className="footer__badge">SIMULATED DEMO DATA</span>
      </footer>
    </div>
  )
}
