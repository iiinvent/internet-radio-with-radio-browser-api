import React from 'react'
import { Play, Pause, Volume2, Radio } from 'lucide-react'
import Knob from './Knob'

export default function Player({ currentStation, isPlaying, volume, onToggle, onVolumeChange }) {
  return (
    <div style={styles.player}>
      {/* Station info */}
      <div style={styles.stationInfo}>
        <div style={styles.stationIconWrap}>
          <div style={styles.stationIconPlaceholder}>
            <Radio size={18} color="#334155" />
          </div>
          {currentStation?.favicon && (
            <img
              src={currentStation.favicon}
              alt=""
              style={styles.stationIcon}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
        </div>
        <div style={styles.stationText}>
          <div style={styles.stationNameDisplay}>
            {currentStation ? currentStation.name : 'NO SIGNAL'}
          </div>
          <div style={styles.stationSubtext}>
            {currentStation
              ? `${currentStation.country || ''} · ${currentStation.codec || ''} · ${currentStation.bitrate || 0}kbps`
              : 'SELECT A STATION'}
          </div>
        </div>
        {isPlaying && (
          <div style={styles.waveform}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ ...styles.bar, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button
          style={{ ...styles.controlBtn, ...(isPlaying ? styles.controlBtnActive : {}) }}
          onClick={onToggle}
          disabled={!currentStation}
        >
          {isPlaying ? <Pause size={18} color="#ef4444" /> : <Play size={18} color={currentStation ? '#94a3b8' : '#334155'} />}
        </button>
      </div>

      {/* Volume knob */}
      <div style={styles.knobSection}>
        <Knob
          label="VOL"
          value={volume}
          min={0}
          max={1}
          onChange={onVolumeChange}
          color="#ef4444"
        />
      </div>
    </div>
  )
}

const styles = {
  player: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#0a0f1a',
    borderTop: '1px solid #1e293b',
    padding: '10px 20px',
    flexShrink: 0,
  },
  stationInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  stationIconWrap: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 6,
    flexShrink: 0,
    overflow: 'hidden',
  },
  stationIconPlaceholder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 6,
    background: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stationIcon: {
    position: 'absolute',
    inset: 0,
    width: 36,
    height: 36,
    objectFit: 'cover',
    borderRadius: 6,
    zIndex: 2,
  },
  stationText: {
    minWidth: 0,
    flex: 1,
  },
  stationNameDisplay: {
    fontFamily: 'Orbitron',
    fontSize: '12px',
    fontWeight: 700,
    color: '#e2e8f0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: '0.05em',
  },
  stationSubtext: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#334155',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  waveform: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: 20,
    flexShrink: 0,
  },
  bar: {
    width: 3,
    background: '#ef4444',
    borderRadius: 2,
    animation: 'waveBar 0.8s ease-in-out infinite alternate',
    minHeight: 4,
  },
  controls: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#1e293b',
    border: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  controlBtnActive: {
    background: '#1a0a0a',
    border: '1px solid #7f1d1d',
    boxShadow: '0 0 10px rgba(239,68,68,0.2)',
  },
  knobSection: {
    flexShrink: 0,
  },
}
