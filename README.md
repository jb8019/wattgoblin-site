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
