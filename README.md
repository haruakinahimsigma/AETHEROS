# AETHER OS
**Beyond the interface.**

AETHER OS is a responsive, browser-based desktop experience with a dark glass UI, movable app windows, a dock, app launcher, quick settings, and locally saved workspace data.

## Run it
Open `index.html` in a browser, or deploy this repository as a static site. No build step or package installation is required.

## Included apps
- **Interstellar Browser** — address bar, embedded browsing, and open-in-new-tab fallback. Default home: https://iwannapoop676767.up.railway.app
- **Files** — demo virtual folders and files saved in local browser storage.
- **Notes** — multiple editable notes with automatic local saving.
- **Terminal** — simulated shell commands: `help`, `date`, `whoami`, `ls`, `echo`, `open`, `theme`, `neofetch`, and `clear`.
- **Calculator** — basic arithmetic.
- **Settings** — focus mode, ambient glow, wallpaper colors, and browser home reset.

## Controls
- Click a desktop icon or dock icon to open an app.
- Drag a window by its title bar.
- Use the window dots to minimize, maximize, or close.
- Press **⌘K** (or **Ctrl+K**) to open the app launcher.
- Press **Esc** to dismiss popovers.
- Press **⌘W** (or **Ctrl+W**) to close the topmost app window.

## Notes and limitations
This is a web app that simulates a desktop, not a bootable operating system or a replacement for iPadOS. Browser sandboxing and websites' frame restrictions can prevent some sites from displaying inside Interstellar; use **Open in new tab** when needed. Files and notes are stored locally in the current browser profile and are not synced to a server.

## Project files
- `index.html` — desktop markup
- `style.css` — responsive visual design
- `app.js` — app logic and local persistence
