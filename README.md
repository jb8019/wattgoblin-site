# WattGoblin Website V10 — V7 Style Restored

This package restores the richer pre-launch presentation from the earlier WattGoblin V7 lineage and adds the official developer fee wallet without removing the older features.

## Restored / retained
- Animated grid + neon mining aesthetic
- Scrolling mining / compute ticker
- Launch countdown console
- Live system clock
- Live project-status timeline feed
- Rich vertical roadmap timeline with status badges
- Community Terminal with Giscus / GitHub Discussions
- Project, Roadmap, Community, Legal & Transparency pages
- WattGoblin mascot asset
- GitHub Pages `CNAME` for `wattgoblin.xyz`

## Official developer fee wallet
OFFICIAL @WattGoblinSOL DEVELOPER FEE WALLET

`BC92zfkGFWNzjEkgMxfPMB4BNDcrC5mXWP6zizcd4nZS`

The wallet is linked to Solscan on the Home, Project, Legal pages and footer.

## Countdown
The countdown is intentionally in `LAUNCH TIME LOCKING IN` mode because no official launch date is configured yet.
When the date is final, edit `config.js`:

```js
launchDate: "2026-09-25T18:00:00-07:00",
```

Use the actual official date/time; the site will begin counting down automatically.

## Upload to GitHub Pages
1. Extract this ZIP.
2. Upload **the files inside the extracted folder** to the root of `jb8019/wattgoblin-site`.
3. Replace the older files when GitHub asks.
4. Commit the changes.
5. Leave `CNAME` and `.nojekyll` in the repository root.

## Notes
The live site timeline is a client-side project-status display, not external market, blockchain, exchange, or mining telemetry.
