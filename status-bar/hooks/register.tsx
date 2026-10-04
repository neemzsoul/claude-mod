import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { formatStatus } from './format'

const line = atom({ plugin: 'status-bar', key: 'line' } as const, '')

// Re-reads the session's figures, pins them under the prompt (status line)
// and stores them for the band above the prompt.
async function refresh($: EngineInterface): Promise<void> {
  const [model, folder, usage] = await Promise.all([
    $.session.model(),
    $.session.root(),
    $.session.usage(),
  ])
  const text = formatStatus({
    model,
    folder,
    percent: usage.context.percent,
    usd: usage.cost?.usd,
  })
  $.ui.status(text)
  await update($, line, () => text)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await refresh($)
    return result
  })

  on('session.attach', async ($, e, next) => {
    const result = await next(e)
    await refresh($)
    return result
  })

  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    await refresh($)
    return result
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    await refresh($)
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const text = await read($, line)
    if (e.props.hasSurvey || !text) return next(e)
    const { Text } = $.ui.resolve(e)
    return <Text dimColor>{text}</Text>
  })
}
