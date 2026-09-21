# WattGoblin Website V2

This is the upgraded WattGoblin.xyz static site for GitHub Pages.

## What changed
- More distinctive cyber/mining visual design
- Live launch countdown component
- New Project page with intentions and goals
- New Roadmap page
- Stronger official-contract / anti-impersonation messaging
- Mobile responsive layout

## IMPORTANT: Set the launch countdown
Open `config.js` and replace:

    launchISO: null

with the exact launch time in ISO-8601 format, for example:

    launchISO: "2026-09-25T18:00:00-07:00"

Do not use the example unless that is actually the intended launch time.

## Update the live GitHub site
Upload/replace these files in the root of the existing `wattgoblin-site` repository:
- index.html
- project.html
- roadmap.html
- styles.css
- config.js
- script.js
- CNAME
- README.md
- assets/ folder

GitHub Pages should redeploy automatically after the commit.

## At token launch
In `index.html`, replace `COMING AT LAUNCH` with the verified official contract address.

The roadmap is intentionally framed as goals rather than guaranteed promises.


## Community Terminal
V3 adds `community.html`, a public feedback/community page designed for GitHub Discussions via Giscus.

### To make comments live
1. In GitHub repository Settings/General, enable **Discussions**.
2. Open the repository's Discussions tab and create/use a category such as **Suggestions**.
3. Go to https://giscus.app/
4. Configure it for `jb8019/wattgoblin-site`.
5. Copy the generated embed script.
6. Open `community.html`.
7. Replace the placeholder inside `#giscus-container` with the real Giscus script.

This requires visitors to sign in with GitHub to post. If you later want anonymous/no-GitHub submissions,
use a separate form service in addition to the public board.


## V4 — Legal & Transparency
V4 adds `legal.html` and links it throughout the site.

The page covers:
- token nature and risk disclosures
- no equity/profit-share/revenue rights
- creator fees and creator/project revenue
- intended uses of revenue
- developer compensation/personal living expenses disclosure
- possible hardware/mining/compute spending
- community initiatives
- buybacks/burns/giveaways as optional, not promised
- wallet/contract transparency
- community moderation
- third-party services/privacy
- taxes/compliance
- change/version policy

IMPORTANT: This draft is intended as a transparent project disclosure, not a substitute for legal advice.
Before launch, have a qualified attorney review the final public wording if practical, especially any contest,
giveaway, buyback, burn, revenue-allocation or utility claims.


## V5 — Final for now
- Adds a planned project stake / strategic reserve target of up to 10% of total $WGBL supply.
- Planned purchases are discretionary and are explicitly not price support.
- Adds official Discord to the roadmap.
- Adds a WattGoblin community mining pool to the roadmap.
- Mining-pool rules/economics must be published separately before launch.
- Holding $WGBL does not automatically create mining-pool access, payouts or yield.


## V7 — Pre-launch site completion
Added:
- Official Links / Verification block
- Scam & wallet-security warning
- Token plan with planned 1B supply and 10% project stake/reserve target
- Creator/Project Operator section (creator-owned, one-person team, regular 5–7 day work schedule, organic community-driven growth)
- FAQ page
- Transparency / Updates log
- Stronger official Discord roadmap and verification language
- Dedicated community-mining-pool policy
- Community-pool mining rewards reserved for community-scheduled $WGBL buybacks/burns and excluded from creator compensation
- Legal page consistency for creator compensation vs. mining-pool rewards

Before launch:
1. Set the real launch date/time in config.js.
2. Replace COMING AT LAUNCH with the verified contract address.
3. Add the verified Pump.fun URL.
4. Only add a Discord URL after the official server actually exists.
5. Final mining-pool implementation should publish technical rules and legal terms before going live.


## V9 — Official Launch Locked
- Official launch: September 21, 2026
- Time: 9:00 AM PT / 12:00 PM ET
- Countdown target: `2026-09-21T09:00:00-07:00`
- Planned initial project buy: approximately $30 worth of $WGBL from the official project wallet
- Transparency Log and Legal & Transparency page updated with the launch timing and initial buy disclosure
- Giscus Community Terminal remains connected to `👺💡 Goblin Ideas`

Immediately after launch:
1. Replace `COMING AT LAUNCH` with the verified official contract address.
2. Add the official Pump.fun coin URL.
3. Publish the same verified address on @WattGoblinSOL.
