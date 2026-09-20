import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [elapsed, setElapsed] = useState(0)
  const [previousRecordedTime, setPreviousRecordedTime] = useState(60000)
  const [isRunning, setIsRunning] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [largePieces, setLargePieces] = useState('14')
  const [shortPieces, setShortPieces] = useState('1')

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
  const bestRecordedTime = previousRecordedTime > 0 ? previousRecordedTime : 60000
  const activeProgressTime = isRunning ? elapsed : bestRecordedTime || elapsed
  const progress = bestRecordedTime > 0 ? (activeProgressTime % bestRecordedTime) / bestRecordedTime * 100 : 0
  const distanceCm = Number(largePieces || 0) * 30 + Number(shortPieces || 0) * 17
  const elapsedSeconds = elapsed / 1000
  const speedCmPerSecond = elapsedSeconds > 0 ? distanceCm / elapsedSeconds : 0
  const speedMetersPerSecond = speedCmPerSecond / 100
  const speedKilometersPerHour = speedMetersPerSecond * 3.6
  const hasResult = !isRunning && elapsed > 0

  const toggleTimer = () => {
    if (isRunning) {
      setPreviousRecordedTime((currentRecordedTime) => {
        if (elapsed <= 0) return currentRecordedTime
        if (currentRecordedTime === 0) return elapsed
        return Math.min(currentRecordedTime, elapsed)
      })
      setIsRunning(false)
      return
    }

    setElapsed(0)
    setIsRunning(true)
  }

  const resetTimer = () => {
    setElapsed(0)
    setPreviousRecordedTime(60000)
    setIsRunning(false)
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="timer-heading">
          <h1>Bruno<br /><em>HOT WHEELS</em></h1>
        </div>
      </header>

      <section className="timer-shell" aria-label="Speed timer">
        <div className="config-panel">
          <button
            type="button"
            className="config-toggle"
            onClick={() => setIsConfigOpen((open) => !open)}
            aria-expanded={isConfigOpen}
            aria-controls="track-config"
          >
            <span>CONFIGURACIÓ</span>
            <span className={`config-toggle-icon ${isConfigOpen ? 'is-open' : ''}`}>▾</span>
          </button>

          <div id="track-config" className={`config-content ${isConfigOpen ? 'is-open' : ''}`}>
            <div className="distance-inputs" aria-label="Track distance inputs">
              <label>
                <span>30 CM PISTA</span>
                <input type="number" min="0" step="1" inputMode="numeric" value={largePieces} onChange={(event) => setLargePieces(event.target.value)} />
                <small>PECES</small>
              </label>
              <label>
                <span>17 CM PISTA</span>
                <input type="number" min="0" step="1" inputMode="numeric" value={shortPieces} onChange={(event) => setShortPieces(event.target.value)} />
                <small>PECES</small>
              </label>
              <div className="distance-total"><span>DISTANCIA TOTAL</span><strong>{distanceCm / 100}<small> m</small></strong></div>
            </div>
          </div>
        </div>

        <div className="display-frame">
          <div className="display-label">TEMPS ACTUAL</div>
          <div className="timer-display" aria-live="polite">{formattedTime}</div>
          <div className="track" aria-hidden="true">
            <div className="track-fill" style={{ width: `${progress}%` }} />
            <span className="track-marker marker-start" />
            <span className="track-marker marker-end" />
          </div>
          <div className="track-labels"><span>INICI</span><span>{bestRecordedTime > 0 ? `${(bestRecordedTime / 1000).toFixed(1)}s` : '60.0s'}</span></div>


        </div>

        <div className="controls">
          <button className={`start-button ${isRunning ? 'is-stop' : ''}`} type="button" onClick={toggleTimer}>
            {isRunning ? 'PARA, SI US PLAU, EL MEU ELEGANTÍSSIM HOT WHEEL' : 'COMENÇA, SI US PLAU EL MEU ELEGANTÍSSIM HOT WHEEL'}
          </button>
          <button className="reset-button" type="button" onClick={resetTimer} aria-label="Reset timer">
            <span aria-hidden="true">↺</span>
          </button>
        </div>
        <div className={`speed-result ${hasResult ? 'is-visible' : 'speed-result-hidden'}`} aria-live={hasResult ? 'polite' : undefined}>
          <div className="speed-main">
            <span className="speed-result-label">VELOCITAT MITJANA</span>
            <div className="speed-value-wrap">
              <strong>{speedKilometersPerHour.toFixed(2)} <small>km/h</small></strong>
            </div>
            <span className="speed-secondary">{speedCmPerSecond.toFixed(1)} cm/s <i>/</i> {speedMetersPerSecond.toFixed(2)} m/s</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
