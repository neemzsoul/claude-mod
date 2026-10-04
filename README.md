# claude-mod — my Claude Code status line

Adds a one-line bar at the bottom of Claude Code that shows:

```
Opus · my-project  ctx ██████░░░░ 63%  · $1.23
```

- **Model** you're talking to
- **Folder** you're working in
- **ctx bar** — how full Claude's memory (context) is for this chat. Green under 50%,
  yellow from 50%, red from 80%. When it's red, Claude will soon start forgetting
  older parts of the chat, so it's a good time to start a fresh one.
- **Cost** of this session so far (in US dollars)

## Two versions

| Version | Shows up in | Folder |
|---|---|---|
| **Status line** (the original) | Claude Code in a terminal only | `statusline.sh` |
| **Status bar mod** (new) | The Claude app (desktop, web, phone) *and* the terminal | `status-bar/` |

The Claude app doesn't draw terminal status lines, so if you follow sessions in the app,
use the mod. Both show the same thing; in the mod the colour is a dot (🟢 🟡 🔴) in front
of the bar, since the app shows plain text.

## Files

| File | What it is |
|---|---|
| `statusline.sh` | The status line itself |
| `install.sh` | Turns it on for your computer (backs up your old settings first) |
| `status-bar/` | The mod version (see *Status bar mod* below) |
| `cloud/settings.json` | Ready-made settings for using it in another repo's cloud sessions |

## Turn it on (your computer)

Needs `jq` (a small helper). On a Mac: `brew install jq`.

```bash
git clone https://github.com/neemzsoul/claude-mod.git ~/claude-mod
~/claude-mod/install.sh
```

Then restart Claude Code. The installer saves a copy of your old settings next to
the original (`~/.claude/settings.json.backup-<date>`). To undo, copy that backup
back over `~/.claude/settings.json`.

## Change how it looks

Open `statusline.sh`. The top section has the easy knobs:

- `BAR_WIDTH` — how long the bar is
- `WARN_AT` / `DANGER_AT` — when it turns yellow / red
- `FILLED` / `EMPTY` — the characters the bar is drawn with

The last `printf` line decides what's shown and in what order. Changes take effect
straight away — no reinstall needed. Or just ask Claude: *"in ~/claude-mod, make the
status line also show X"*.

## Use it in another repo's cloud sessions

Cloud sessions (claude.ai/code) run on a fresh temporary computer each time, so your
own computer's settings don't come along. Instead, put the mod *inside the repo*:

1. Copy `statusline.sh` into that repo as `.claude/statusline.sh`.
2. Copy `cloud/settings.json` into that repo as `.claude/settings.json`
   (if it already has one, just add the `"statusLine"` part to it).
3. Commit and push.

Easiest: open a session in that repo and tell Claude *"add my status line from
github.com/neemzsoul/claude-mod to this repo's .claude folder"*.

## Status bar mod (for the Claude app)

`status-bar/` is a Claude Code mod (a plugin). It pins one line under the prompt:

```
Opus 5.5 · my-project · ctx 🟡 ██████░░░░ 63% · $1.23
```

It shows as a line under the prompt and as a thin strip just above it (the desktop
app draws the strip). It updates when a session starts, after every tool Claude uses, and at the end of
every reply.

**Where it shows:**
- Claude Code on your own computer (the terminal, or the desktop app working on a
  local folder): as a line under the prompt and a strip above it.
- Cloud sessions (claude.ai/code, or the app watching a cloud session): the app has no
  sticky spot for mods there, so instead the line is posted as a small grey note in
  the chat at the end of each of Claude's replies.

**Try it in a session:** ask Claude *"load the status-bar mod from
github.com/neemzsoul/claude-mod"*. Claude copies it into the session's mods folder,
and the app asks once whether to turn on hot reloading. Pick **Enable for this
session**.

**In a terminal:** `claude --plugin-dir ~/claude-mod/status-bar`

**Change how it looks:** the top of `status-bar/hooks/format.ts` has the same knobs
as the shell version (`BAR_WIDTH`, `WARN_AT`, `DANGER_AT`, `FILLED`, `EMPTY`).
`formatStatus` at the bottom decides what's shown and in what order.

**Check it still works after a change:** `claude plugin validate status-bar` and
`claude plugin test status-bar`.
