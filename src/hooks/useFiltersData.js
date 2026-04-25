import { useState, useEffect } from 'react'
import { getCountries, getLanguages, getTags } from '../api/radioBrowser'

const COMMON_GENRES = [
  'pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop',
  'country', 'r&b', 'metal', 'indie', 'ambient', 'blues',
  'reggae', 'folk', 'punk', 'soul', 'techno', 'house',
]

export function useFiltersData(filters) {
  const [countries, setCountries] = useState([])
  const [languages, setLanguages] = useState([])
  const [availableTags, setAvailableTags] = useState(COMMON_GENRES)
  const [loadingMeta, setLoadingMeta] = useState(false)

  // Load countries and languages once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [c, l] = await Promise.all([getCountries(), getLanguages()])
        setCountries(c.filter(x => x.name && x.stationcount > 0))
        setLanguages(l.filter(x => x.name && x.stationcount > 0))
      } catch (_) {}
    }
    loadMeta()
  }, [])

  // Reload tags whenever country or language changes
  useEffect(() => {
    async function loadTags() {
      // No filters active — show default common genres immediately
      if (!filters.country && !filters.language) {
        setAvailableTags(COMMON_GENRES)
        return
      }

      setLoadingMeta(true)
      try {
        const params = {}
        if (filters.country) params.countrycode = filters.country
        if (filters.language) params.language = filters.language

        const tags = await getTags(params)

        const names = tags
          .map(t => t.name?.toLowerCase().trim())
          .filter(Boolean)
          .slice(0, 50)

        setAvailableTags(names.length > 0 ? names : COMMON_GENRES)
      } catch (_) {
        setAvailableTags(COMMON_GENRES)
      } finally {
        setLoadingMeta(false)
      }
    }

    loadTags()
  }, [filters.country, filters.language])

  return { countries, languages, availableTags, loadingMeta, COMMON_GENRES }
}
