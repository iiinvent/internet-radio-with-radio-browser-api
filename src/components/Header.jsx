import React from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function Header() {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <svg width={isMobile ? 28 : 36} height={isMobile ? 28 : 36} viewBox="0 0 36 36">
            <defs>
              <radialGradient id="logoGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <filter id="logoGlow">
                <feGaussianBlur stdDeviation="1.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle cx="18" cy="18" r="17" fill="url(#logoGrad)" stroke="#1e3a5f" strokeWidth="1" />
            <circle cx="18" cy="18" r="12" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4" style={{ animation: 'logoRingPulse 3s ease-in-out infinite' }} />
            <circle cx="18" cy="18" r="7" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.7" />
            <circle cx="18" cy="18" r="3" fill="#ef4444" filter="url(#logoGlow)" />
            <line x1="18" y1="1" x2="18" y2="6" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
          </svg>
        </div>

        <div style={styles.titleGroup}>
          <span style={{ ...styles.title, fontSize: isMobile ? '14px' : '18px' }}>ÆTHER</span>
          <span style={{ ...styles.subtitle, fontSize: isMobile ? '7px' : '8px' }}>RADIO · WORLDWIDE</span>
        </div>
      </div>

      <div style={styles.right}>
        {/* Signal bars */}
        <div style={styles.signalBars}>
          {[3, 5, 7, 9, 11].map((h, i) => (
            <div key={i} style={{
              ...styles.bar,
              height: h,
              animationDelay: `${i * 0.12}s`,
              opacity: i < 3 ? 1 : 0.3,
            }} />
          ))}
        </div>
        {!isMobile && (
          <span style={styles.liveTag}>● LIVE</span>
        )}
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'linear-gradient(180deg, #0a0f1a 0%, #020617 100%)',
    borderBottom: '1px solid #1e293b',
    flexShrink: 0,
    zIndex: 10,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoWrap: {
    position: 'relative',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  title: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '0.2em',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'Share Tech Mono',
    color: '#475569',
    letterSpacing: '0.15em',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  signalBars: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 14,
  },
  bar: {
    width: 3,
    background: '#ef4444',
    borderRadius: 1,
    animation: 'waveBar 0.8s ease-in-out infinite alternate',
  },
  liveTag: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#ef4444',
    letterSpacing: '0.15em',
    animation: 'dotBlink 1.5s ease-in-out infinite',
  },
}
