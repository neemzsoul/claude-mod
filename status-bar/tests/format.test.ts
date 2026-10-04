import { expect, test } from 'claude-code/testing'

import { formatStatus, shortModel } from '../hooks/format'

test('shortens model ids', async () => {
  expect(shortModel('claude-opus-5-5')).toBe('Opus 5.5')
  expect(shortModel('claude-haiku-4-5-20251001')).toBe('Haiku 4.5')
  expect(shortModel('Opus 5.5')).toBe('Opus 5.5')
})

test('draws the bar with the right colour dot', async () => {
  expect(
    formatStatus({ model: 'claude-opus-5-5', folder: '/home/user/my-project/', percent: 63, usd: 1.234 }),
  ).toBe('Opus 5.5 · my-project · ctx 🟡 ██████░░░░ 63% · $1.23')
  expect(formatStatus({ model: 'X', folder: '/a', percent: 12 })).toContain('🟢 █░░░░░░░░░ 12% · $0.00')
  expect(formatStatus({ model: 'X', folder: '/a', percent: 140 })).toContain('🔴 ██████████ 100%')
  expect(formatStatus({ model: 'X', folder: '/a' })).toContain('🟢 ░░░░░░░░░░ 0%')
})
