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

## Files

| File | What it is |
|---|---|
| `statusline.sh` | The status line itself |
| `install.sh` | Turns it on for your computer (backs up your old settings first) |
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
