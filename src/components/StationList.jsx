import React from 'react'
import { Radio, Wifi, Music } from 'lucide-react'

function StationCard({ station, isActive, onPlay }) {
  const favicon = station.favicon
  const votes = station.votes > 999
    ? `${(station.votes / 1000).toFixed(1)}k`
    : station.votes

  return (
    <button
      style={{
        ...styles.card,
        ...(isActive ? styles.cardActive : {}),
      }}
      onClick={() => onPlay(station)}
    >
      <div style={styles.cardLeft}>
        <div style={styles.faviconWrapper}>
          <div style={styles.faviconPlaceholder}>
            <Radio size={14} color="#475569" />
          </div>
          {favicon && (
            <img
              src={favicon}
              alt=""
              style={styles.favicon}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
        </div>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.stationName}>{station.name}</div>
        <div style={styles.stationMeta}>
          {station.country && <span style={styles.metaChip}>{station.country}</span>}
          {station.codec && <span style={styles.metaChip}>{station.codec}</span>}
          {station.bitrate > 0 && <span style={styles.metaChip}>{station.bitrate}k</span>}
          {station.language && <span style={styles.metaChip}>{station.language}</span>}
        </div>
        {station.tags && (
          <div style={styles.tags}>
            {station.tags.split(',').slice(0, 3).map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={styles.tagPill}>{t}</span>
            ))}
          </div>
        )}
      </div>

      <div style={styles.cardRight}>
        {isActive && (
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot} />
            <span style={styles.liveText}>LIVE</span>
          </div>
        )}
        <div style={styles.votes}>
          <Wifi size={10} color="#334155" />
          <span>{votes}</span>
        </div>
      </div>
    </button>
  )
}

export default function StationList({ stations, currentStation, onPlay, loading, error }) {
  if (loading) {
    return (
      <div style={styles.centerState}>
        <div style={styles.scanLine} />
        <span style={styles.loadingText}>SCANNING FREQUENCIES...</span>
        <div style={styles.loadingDots}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ ...styles.dot, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.centerState}>
        <Music size={32} color="#334155" />
        <span style={styles.errorText}>Signal lost. Check connection.</span>
      </div>
    )
  }

  if (!stations.length) {
    return (
      <div style={styles.centerState}>
        <Radio size={32} color="#334155" />
        <span style={styles.emptyText}>No stations found</span>
      </div>
    )
  }

  return (
    <div style={styles.list}>
      {stations.map(station => (
        <StationCard
          key={station.stationuuid}
          station={station}
          isActive={currentStation?.stationuuid === station.stationuuid}
          onPlay={onPlay}
        />
      ))}
    </div>
  )
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    padding: '8px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#0f172a',
    border: '1px solid transparent',
    borderRadius: 6,
    padding: '10px 12px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.15s',
    width: '100%',
  },
  cardActive: {
    background: '#1a0a0a',
    border: '1px solid #7f1d1d',
    boxShadow: '0 0 12px rgba(239,68,68,0.1)',
  },
  cardLeft: {
    flexShrink: 0,
  },
  faviconWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    borderRadius: 4,
    flexShrink: 0,
  },
  faviconPlaceholder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 4,
    background: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  favicon: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    objectFit: 'cover',
    zIndex: 2,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  stationName: {
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stationMeta: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  metaChip: {
    background: '#1e293b',
    color: '#475569',
    fontSize: '9px',
    fontFamily: 'Share Tech Mono',
    padding: '1px 5px',
    borderRadius: 2,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  tags: {
    display: 'flex',
    gap: 3,
    flexWrap: 'wrap',
  },
  tagPill: {
    color: '#334155',
    fontSize: '9px',
    fontFamily: 'Share Tech Mono',
    letterSpacing: '0.04em',
  },
  cardRight: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#ef4444',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  liveText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#ef4444',
    letterSpacing: '0.1em',
  },
  votes: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    color: '#334155',
    fontSize: '9px',
    fontFamily: 'Share Tech Mono',
  },
  centerState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: '60px 20px',
    color: '#334155',
  },
  scanLine: {
    width: 200,
    height: 2,
    background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
    animation: 'scan 1.5s ease-in-out infinite',
  },
  loadingText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '11px',
    color: '#334155',
    letterSpacing: '0.15em',
  },
  loadingDots: {
    display: 'flex',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#ef4444',
    animation: 'dotPulse 1s ease-in-out infinite',
  },
  errorText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '12px',
    color: '#475569',
    letterSpacing: '0.1em',
  },
  emptyText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '12px',
    color: '#334155',
    letterSpacing: '0.1em',
  },
}
