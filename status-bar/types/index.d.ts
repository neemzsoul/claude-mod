export type Line = string

declare module 'claude-code' {
  interface PluginState {
    'status-bar': { line: Line }
  }
}
