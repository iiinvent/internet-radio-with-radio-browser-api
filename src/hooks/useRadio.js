import { useState, useEffect, useRef, useMemo } from 'react'
import { searchStations, clickStation } from '../api/radioBrowser'
import { fuzzyMatch, fuzzyScore } from '../utils/fuzzyMatch'

const INITIAL_FILTERS = {
  country: '',
  language: '',
  tag: '',
  bitrate: '',
  codec: '',
  search: '',
}

export function useRadio() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStation, setCurrentStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const audioRef = useRef(null)
  const playLockRef = useRef(false)

  useEffect(() => {
    async function fetchStations() {
      setLoading(true)
      setError(null)
      try {
        const params = {}
        if (filters.country) params.countrycode = filters.country
        if (filters.language) params.language = filters.language.toLowerCase()
        if (filters.tag) params.tag = filters.tag
        if (filters.bitrate) params.bitratemin = filters.bitrate
        if (filters.codec) params.codec = filters.codec

        const data = await searchStations(params)

        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => {
          const votesA = parseInt(a.votes) || 0
          const votesB = parseInt(b.votes) || 0
          return votesB - votesA
        })

        setStations(sorted)
      } catch (err) {
        setError(err.message)
        setStations([])
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [filters.country, filters.language, filters.tag, filters.bitrate, filters.codec])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const filteredStations = useMemo(() => {
    const query = (filters.search || '').trim()
    if (!query) return stations

    const matched = stations.filter(station =>
      [station.name, station.country, station.language, station.tags]
        .some(f => fuzzyMatch(f, query))
    )

    matched.sort((a, b) => {
      const scoreDiff = fuzzyScore(b, query) - fuzzyScore(a, query)
      if (scoreDiff !== 0) return scoreDiff
      return (parseInt(b.votes) || 0) - (parseInt(a.votes) || 0)
    })

    return matched
  }, [stations, filters.search])

  function playStation(station) {
    if (playLockRef.current) return
    playLockRef.current = true

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }

      setCurrentStation(station)
      setIsPlaying(true)

      const audio = new Audio()
      audio.volume = volume
      audio.src = station.url
      audioRef.current = audio

      audio.play().catch(err => {
        console.error('Playback error:', err)
        setIsPlaying(false)
      })

      clickStation(station.stationuuid)
    } finally {
      playLockRef.current = false
    }
  }

  function togglePlay() {
    if (!audioRef.current || !currentStation) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  function stopStation() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setCurrentStation(null)
    setIsPlaying(false)
  }

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS)
    stopStation()
  }

  return {
    stations: filteredStations,
    loading,
    error,
    currentStation,
    isPlaying,
    volume,
    filters,
    setVolume,
    playStation,
    togglePlay,
    stopStation,
    updateFilter,
    clearFilters,
  }
}
