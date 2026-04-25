import React from 'react'

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <div style={styles.logoRing} />
          <div style={styles.logoDot} />
        </div>
        <div>
          <div style={styles.logoText}>ÆTHER</div>
          <div style={styles.logoSub}>RADIO</div>
        </div>
      </div>

      <div style={styles.display}>
        <div style={styles.displayInner}>
          <span style={styles.displayLabel}>INTERNET RADIO</span>
          <div style={styles.displayDots}>
            {[0,1,2].map(i => (
              <div key={i} style={{ ...styles.displayDot, animationDelay: `${i * 0.4}s` }} />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.signalBars}>
          {[3, 5, 7, 9, 11].map((h, i) => (
            <div key={i} style={{ ...styles.signalBar, height: h, opacity: i < 4 ? 1 : 0.2 }} />
          ))}
        </div>
        <span style={styles.signalLabel}>SIGNAL</span>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#0a0f1a',
    borderBottom: '1px solid #1e293b',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 28,
    height: 28,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '2px solid #ef4444',
    opacity: 0.6,
    animation: 'logoRingPulse 2s ease-in-out infinite',
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#ef4444',
    boxShadow: '0 0 8px #ef4444',
  },
  logoText: {
    fontFamily: 'Orbitron',
    fontSize: '16px',
    fontWeight: 900,
    color: '#f8fafc',
    letterSpacing: '0.15em',
    lineHeight: 1,
  },
  logoSub: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#ef4444',
    letterSpacing: '0.3em',
    lineHeight: 1.4,
  },
  display: {
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 4,
    padding: '6px 16px',
  },
  displayInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  displayLabel: {
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    color: '#334155',
    letterSpacing: '0.2em',
  },
  displayDots: {
    display: 'flex',
    gap: 4,
  },
  displayDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: '#ef4444',
    animation: 'dotBlink 1.2s ease-in-out infinite',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  signalBars: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
  },
  signalBar: {
    width: 4,
    background: '#ef4444',
    borderRadius: 1,
    boxShadow: '0 0 4px rgba(239,68,68,0.4)',
  },
  signalLabel: {
    fontFamily: 'Share Tech Mono',
    fontSize: '7px',
    color: '#334155',
    letterSpacing: '0.15em',
  },
}
