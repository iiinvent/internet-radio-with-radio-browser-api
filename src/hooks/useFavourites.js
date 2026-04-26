import { useState, useCallback } from 'react'

const STORAGE_KEY = 'aether_favourites'

function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavourites(favs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
  } catch {}
}

export function useFavourites() {
  const [favourites, setFavourites] = useState(loadFavourites)

  const isFavourite = useCallback((stationuuid) => {
    return favourites.some(f => f.stationuuid === stationuuid)
  }, [favourites])

  const toggleFavourite = useCallback((station) => {
    setFavourites(prev => {
      const exists = prev.some(f => f.stationuuid === station.stationuuid)
      const next = exists
        ? prev.filter(f => f.stationuuid !== station.stationuuid)
        : [...prev, { ...station, savedAt: Date.now() }]
      saveFavourites(next)
      return next
    })
  }, [])

  const clearFavourites = useCallback(() => {
    setFavourites([])
    saveFavourites([])
  }, [])

  return { favourites, isFavourite, toggleFavourite, clearFavourites }
}
