import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [largePieces, setLargePieces] = useState('0')
  const [shortPieces, setShortPieces] = useState('0')

  useEffect(() => {
    if (!isRunning) return undefined

    const startedAt = Date.now() - elapsed
    const interval = window.setInterval(() => {
      setElapsed(Date.now() - startedAt)
    }, 37)

    return () => window.clearInterval(interval)
  }, [isRunning, elapsed])

  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)
  const milliseconds = Math.floor((elapsed % 1000) / 10)
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
  const progress = (elapsed % 60000) / 60000 * 100
  const distanceCm = Number(largePieces || 0) * 30 + Number(shortPieces || 0) * 17
  const elapsedSeconds = elapsed / 1000
  const speedCmPerSecond = elapsedSeconds > 0 ? distanceCm / elapsedSeconds : 0
  const speedMetersPerSecond = speedCmPerSecond / 100
  const speedKilometersPerHour = speedMetersPerSecond * 3.6
  const hasResult = !isRunning && elapsed > 0

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false)
      return
    }

    setElapsed(0)
    setIsRunning(true)
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand-mark" aria-label="Hot Wheels Speed Racer">
          <span className="brand-hot">HOT</span>
          <span className="brand-wheels">WHEELS</span>
        </div>
        <div className="session-tag"><span className="live-dot" /> LIVE SESSION 01</div>
      </header>

      <section className="timer-shell" aria-label="Speed timer">
        <div className="eyebrow"><span>01</span> / PIT WALL CHRONO</div>
        <div className="timer-heading">
          <h1>Find your<br /><em>fast line.</em></h1>
          <div className={`status ${isRunning ? 'status-running' : ''}`}>
            <span className="status-light" />
            {isRunning ? 'CLOCK RUNNING' : hasResult ? 'SPEED CAPTURED' : 'READY TO RUN'}
          </div>
        </div>

        <div className="distance-inputs" aria-label="Track distance inputs">
          <label>
            <span>30 CM PISTA</span>
            <input type="number" min="0" step="1" inputMode="numeric" value={largePieces} onChange={(event) => setLargePieces(event.target.value)} />
            <small>PIECES</small>
          </label>
          <label>
            <span>17 CM PISTA</span>
            <input type="number" min="0" step="1" inputMode="numeric" value={shortPieces} onChange={(event) => setShortPieces(event.target.value)} />
            <small>PIECES</small>
          </label>
          <div className="distance-total"><span>TOTAL DISTANCE</span><strong>{distanceCm}<small> cm</small></strong></div>
        </div>

        <div className="display-frame">
          <div className="display-label">CURRENT LAP TIME</div>
          <div className="timer-display" aria-live="polite">{formattedTime}</div>
          <div className="track" aria-hidden="true">
            <div className="track-fill" style={{ width: `${progress}%` }} />
            <span className="track-marker marker-start" />
            <span className="track-marker marker-end" />
          </div>
          <div className="track-labels"><span>START</span><span>60 SEC SPLIT</span></div>
          <div className={`speed-result ${hasResult ? '' : 'speed-result-hidden'}`} aria-live={hasResult ? 'polite' : undefined}>
            <span className="speed-result-label">AVERAGE SPEED</span>
            <strong>{speedMetersPerSecond.toFixed(2)} <small>m/s</small></strong>
            <span className="speed-secondary">{speedCmPerSecond.toFixed(1)} cm/s <i>/</i> {speedKilometersPerHour.toFixed(2)} km/h</span>
          </div>
        </div>

        <div className="controls">
          <button className={`start-button ${isRunning ? 'is-stop' : ''}`} type="button" onClick={toggleTimer}>
            <span className="button-icon">{isRunning ? '■' : '▶'}</span>
            {isRunning ? 'STOP CLOCK' : 'START CLOCK'}
          </button>
        </div>
      </section>

      <footer className="footer-bar">
        <span>RACE CONTROL / READY</span>
        <span className="footer-rule" />
        <span>PRECISION TIMING SYSTEM</span>
      </footer>
    </main>
  )
}

export default App
