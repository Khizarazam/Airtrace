function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour12: false })
}

export default function EventLog({ events }) {
  return (
    <div className="panel event-log">
      <div className="panel__header">
        <div>
          <h3>Event log</h3>
          <p className="panel__sub">Live inference events</p>
        </div>
      </div>
      <ul className="event-log__list">
        {events.length === 0 && (
          <li className="event-log__empty">Waiting for first event…</li>
        )}
        {events.map((e) => (
          <li key={e.id} className="event-log__item">
            <span className={`event-log__dot event-log__dot--${e.tone}`} />
            <span className="event-log__text">{e.label}</span>
            <span className="event-log__time">{formatTime(e.time)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
