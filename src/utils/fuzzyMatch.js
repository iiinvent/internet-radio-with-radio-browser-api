/**
 * Lightweight fuzzy match — returns true if all characters in `query`
 * appear in `str` in order (case-insensitive).
 * Also boosts exact substring matches.
 */
export function fuzzyMatch(str, query) {
  if (!query) return true
  if (!str) return false

  const s = str.toLowerCase()
  const q = query.toLowerCase().trim()

  if (!q) return true

  // Fast path: exact substring
  if (s.includes(q)) return true

  // Fuzzy: all chars of query appear in str in order
  let si = 0
  let qi = 0
  while (si < s.length && qi < q.length) {
    if (s[si] === q[qi]) qi++
    si++
  }
  return qi === q.length
}

/**
 * Score a station against a query — higher = better match.
 * Used for sorting results by relevance.
 */
export function fuzzyScore(station, query) {
  if (!query) return 0
  const q = query.toLowerCase().trim()
  if (!q) return 0

  const name = (station.name || '').toLowerCase()
  const country = (station.country || '').toLowerCase()
  const tags = (station.tags || '').toLowerCase()
  const language = (station.language || '').toLowerCase()

  let score = 0

  // Exact name match = highest priority
  if (name === q) score += 1000
  // Name starts with query
  else if (name.startsWith(q)) score += 500
  // Name contains query as substring
  else if (name.includes(q)) score += 200

  // Country / language / tags substring
  if (country.includes(q)) score += 50
  if (language.includes(q)) score += 50
  if (tags.includes(q)) score += 30

  // Fuzzy match on name (already confirmed true if we're here)
  score += 10

  return score
}
