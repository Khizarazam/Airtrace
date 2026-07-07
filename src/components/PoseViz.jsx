import { useEffect, useRef, useState } from 'react'
import './PoseViz.css'

// Simplified 17-keypoint skeleton (COCO-style), normalized to a 200x300 box
const BASE_POSE = {
  nose: [100, 30],
  lEye: [95, 25], rEye: [105, 25],
  lShoulder: [75, 70], rShoulder: [125, 70],
  lElbow: [60, 110], rElbow: [140, 110],
  lWrist: [50, 150], rWrist: [150, 150],
  lHip: [82, 160], rHip: [118, 160],
  lKnee: [80, 215], rKnee: [120, 215],
  lAnkle: [78, 270], rAnkle: [122, 270],
}

const BONES = [
  ['nose', 'lEye'], ['nose', 'rEye'],
  ['lShoulder', 'rShoulder'],
  ['lShoulder', 'lElbow'], ['lElbow', 'lWrist'],
  ['rShoulder', 'rElbow'], ['rElbow', 'rWrist'],
  ['lShoulder', 'lHip'], ['rShoulder', 'rHip'],
  ['lHip', 'rHip'],
  ['lHip', 'lKnee'], ['lKnee', 'lAnkle'],
  ['rHip', 'rKnee'], ['rKnee', 'rAnkle'],
]

function jitteredPose(t, seed, fallAmount = 0) {
  const pose = {}
  for (const [k, [x, y]] of Object.entries(BASE_POSE)) {
    const jx = Math.sin(t * 0.9 + seed + x) * 1.6
    const jy = Math.cos(t * 1.3 + seed + y) * 1.2
    pose[k] = [x + jx, y + jy]
  }
  if (fallAmount > 0) {
    // rotate + squash the whole pose toward horizontal to suggest a fall
    for (const k of Object.keys(pose)) {
      const [x, y] = pose[k]
      const cx = 100, cy = 160
      const angle = (fallAmount * Math.PI) / 2.1
      const dx = x - cx, dy = y - cy
      pose[k] = [
        cx + dx * Math.cos(angle) - dy * Math.sin(angle) * 0.3,
        cy * (1 - fallAmount * 0.4) + dx * Math.sin(angle) * 0.6 + dy * Math.cos(angle) * (1 - fallAmount * 0.5),
      ]
    }
  }
  return pose
}

function Skeleton({ offsetX, seed, fallAmount = 0, dim = false }) {
  const [pose, setPose] = useState(() => jitteredPose(0, seed, fallAmount))
  const raf = useRef()
  const start = useRef(performance.now())

  useEffect(() => {
    function loop(now) {
      const t = (now - start.current) / 1000
      setPose(jitteredPose(t, seed, fallAmount))
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [seed, fallAmount])

  return (
    <g transform={`translate(${offsetX}, 0)`} opacity={dim ? 0.35 : 1}>
      {BONES.map(([a, b], i) => {
        const [x1, y1] = pose[a]
        const [x2, y2] = pose[b]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="pose-bone" />
      })}
      {Object.entries(pose).map(([k, [x, y]]) => (
        <circle key={k} cx={x} cy={y} r={k === 'nose' ? 4 : 3} className="pose-joint" />
      ))}
    </g>
  )
}

export default function PoseViz({ scenario, persons }) {
  const showSkeletons = scenario !== 'empty'
  const count = scenario === 'multi' ? Math.max(1, persons) : 1
  const fallAmount = scenario === 'fall' ? 0.85 : 0

  return (
    <div className="pose-viz">
      <svg viewBox="0 0 400 300" className="pose-viz__svg">
        <defs>
          <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* ambient grid */}
        <g className="pose-viz__grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={'v' + i} x1={i * 50} y1={0} x2={i * 50} y2={300} />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={'h' + i} x1={0} y1={i * 50} x2={400} y2={i * 50} />
          ))}
        </g>

        <g filter="url(#bloom)">
          {showSkeletons && Array.from({ length: count }).map((_, i) => (
            <Skeleton
              key={i}
              offsetX={count === 1 ? 100 : 60 + i * 100}
              seed={i * 2.1}
              fallAmount={fallAmount}
              dim={count > 1 && i > 0}
            />
          ))}
        </g>

        {!showSkeletons && (
          <text x="200" y="155" textAnchor="middle" className="pose-viz__empty-text">
            No motion detected
          </text>
        )}
      </svg>
    </div>
  )
}
