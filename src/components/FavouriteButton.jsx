import React, { useState } from 'react'

export default function FavouriteButton({ isFav, onToggle, size = 'md' }) {
  const [burst, setBurst] = useState(false)

  function handleClick(e) {
    e.stopPropagation()
    if (!isFav) {
      setBurst(true)
      setTimeout(() => setBurst(false), 500)
    }
    onToggle()
  }

  const dim = size === 'sm' ? 26 : size === 'lg' ? 36 : 30
  const iconSize = size === 'sm' ? 11 : size === 'lg' ? 16 : 13

  return (
    <button
      onClick={handleClick}
      title={isFav ? 'Remove from favourites' : 'Add to favourites'}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        background: isFav
          ? 'radial-gradient(circle at 40% 35%, #7f1d1d, #450a0a)'
          : 'transparent',
        border: isFav ? '1px solid #ef4444' : '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        transform: burst ? 'scale(1.35)' : 'scale(1)',
        boxShadow: isFav ? '0 0 8px rgba(239,68,68,0.4)' : 'none',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 16 16"
        fill={isFav ? '#ef4444' : 'none'}
        stroke={isFav ? '#ef4444' : '#334155'}
        strokeWidth="1.5"
        style={{
          filter: isFav ? 'drop-shadow(0 0 3px rgba(239,68,68,0.7))' : 'none',
          transition: 'all 0.2s',
        }}
      >
        <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" />
      </svg>

      {/* Burst particles */}
      {burst && (
        <>
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: '#ef4444',
                top: '50%',
                left: '50%',
                transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-12px)`,
                animation: 'burstParticle 0.45s ease-out forwards',
                animationDelay: `${i * 0.02}s`,
                opacity: 0,
              }}
            />
          ))}
        </>
      )}
    </button>
  )
}
