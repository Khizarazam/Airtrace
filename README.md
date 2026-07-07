# AirTrace — Live WiFi Sensing Dashboard

A real-time dashboard UI inspired by WiFi-sensing projects like RuView — presence detection,
contactless heart rate / respiration, signal strength, and a live event log — built with
Vite + React.

> **Note:** This project ships with a **simulated real-time data stream**
> (`src/hooks/useLiveSensing.js`) so it runs instantly with no hardware.
> The values (heart rate, respiration, RSSI, motion, presence) update every ~1.2s using a
> random-walk simulation. To wire it to real data, replace the hook's internals with a
> WebSocket / SSE / fetch-polling connection to your actual sensor backend — every component
> already consumes plain state, so no other file needs to change.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  hooks/
    useLiveSensing.js   # simulated real-time data source (swap for a real feed)
  components/
    RadarSweep.jsx       # animated radar/sonar sweep with presence blips
    VitalsChart.jsx      # live heart rate & respiration area chart (recharts)
    StatsGrid.jsx         # signal strength, motion variance, confidence, presence
    EventLog.jsx          # scrolling live inference event feed
  App.jsx / App.css       # layout + design tokens
```

## Connecting real data

Swap the body of `useLiveSensing` for something like:

```js
useEffect(() => {
  const ws = new WebSocket('ws://your-sensor-node/stream')
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data)
    setHeartRate(data.heartRate)
    setRespiration(data.respiration)
    // ...etc
  }
  return () => ws.close()
}, [])
```

Everything downstream (charts, radar, stats, event log) already reacts to state changes.
