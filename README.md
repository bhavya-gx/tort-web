# Tort, web version

Browser port of the Mac desktop pet at `../desktop-pet`. Same personality and
animation engine, no Electron: a static page with no build step, no server,
no dependencies.

## Differences from the Mac app

- Lives inside a bounded `#stage` on the page, not a full-screen overlay.
- No study-tracker network poll (`STUDY.enabled: false` in `config.js`): a
  public page can't reach a tracker on someone's own Mac. The three reward
  tiers (water/fed/clean) are demoed with buttons instead.
- "Come here" walks to wherever you last moved the mouse inside the stage,
  tracked locally, instead of querying Electron's cursor IPC.
- Double-click still vanishes him. There's no OS window or tray to bring him
  back from, so any click on the stage revives him instead.
- State (care loop, mood, today's affirmations) persists to `localStorage`
  instead of a file on disk. Per-browser, not shared across devices.

## Run it locally

```bash
python3 -m http.server 4720
```

Then open `http://localhost:4720`.

## Deploy

It's fully static, any of these work with zero config:

- **Vercel**: `vercel --prod` from this directory, or drag the folder into
  the Vercel dashboard.
- **Netlify**: drag the folder into the Netlify dashboard, or `netlify deploy`.
- **GitHub Pages**: push this directory to a repo, enable Pages on it.

No environment variables, no build step, no API keys.
