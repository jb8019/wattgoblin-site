# WattGoblin Website

This folder is ready for GitHub Pages.

## Files
- `index.html` — the website
- `styles.css` — all styling
- `CNAME` — tells GitHub Pages the custom domain is `wattgoblin.xyz`
- `assets/` — WattGoblin artwork and favicon

## Publish on GitHub Pages
1. Create a new public GitHub repository named `wattgoblin-site`.
2. Upload **everything inside this folder** to the root of the repository.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Save.
6. In the **Custom domain** box, enter:
   `wattgoblin.xyz`
7. Save.

After GitHub is configured, point Porkbun DNS at GitHub Pages.

## Before token launch
In `index.html`, find:

    COMING AT LAUNCH

and replace that text with the official Solana contract address after the Pump.fun token is created.

Do not publish a contract address anywhere until it has been verified against the actual token you created.
