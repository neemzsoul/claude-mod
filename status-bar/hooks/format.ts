// Builds the one-line status text, e.g.
//   Opus 5.5 · my-project · ctx 🟡 ██████░░░░ 63% · $1.23

// ---- Settings you can change ------------------------------------------------
export const BAR_WIDTH = 10 // how many blocks the context bar has
export const WARN_AT = 50 // dot turns yellow at this % of context used
export const DANGER_AT = 80 // dot turns red at this % of context used
const FILLED = '█' // character for the used part of the bar
const EMPTY = '░' // character for the unused part of the bar
// -----------------------------------------------------------------------------

export type Reading = {
  model: string
  folder: string
  percent?: number
  usd?: number
}

// "claude-opus-5-5" -> "Opus 5.5"; anything else is kept as given.
export function shortModel(model: string): string {
  const m = /^claude-([a-z]+)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?/.exec(model)
  if (!m || !m[1] || !m[2]) return model
  const name = m[1][0]!.toUpperCase() + m[1].slice(1)
  return m[3] ? `${name} ${m[2]}.${m[3]}` : `${name} ${m[2]}`
}

export function lastFolder(path: string): string {
  return path.replace(/\/+$/, '').split('/').pop() || path
}

export function formatStatus(r: Reading): string {
  const pct = Math.max(0, Math.min(100, Math.floor(r.percent ?? 0)))
  const dot = pct >= DANGER_AT ? '🔴' : pct >= WARN_AT ? '🟡' : '🟢'
  const filled = Math.floor((pct * BAR_WIDTH) / 100)
  const bar = FILLED.repeat(filled) + EMPTY.repeat(BAR_WIDTH - filled)
  const cost = `$${(r.usd ?? 0).toFixed(2)}`
  return `${shortModel(r.model)} · ${lastFolder(r.folder)} · ctx ${dot} ${bar} ${pct}% · ${cost}`
}
