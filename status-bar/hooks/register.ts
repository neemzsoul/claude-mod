import type { EngineInterface, Register } from 'claude-code'

import { formatStatus } from './format'

// Re-reads the session's figures and pins them under the prompt.
async function refresh($: EngineInterface): Promise<void> {
  const [model, folder, usage] = await Promise.all([
    $.session.model(),
    $.session.root(),
    $.session.usage(),
  ])
  $.ui.status(
    formatStatus({
      model,
      folder,
      percent: usage.context.percent,
      usd: usage.cost?.usd,
    }),
  )
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await refresh($)
    return result
  })

  // Context and cost move after each model reply and tool result.
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
}
