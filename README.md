# AETHER OS
**Beyond the interface.**

AETHER OS is a browser-based desktop inspired by macOS: floating windows, a glassy dock, light and dark appearances, keyboard shortcuts, and local persistence. It is a web app, not a bootable operating system.

## Run it
Open `index.html` in a modern browser, or deploy this repository as a static site. No build step or package installation is required.

## Apps
- **Interstellar Browser** — address bar plus DuckDuckGo HTML search; some websites block iframe embedding, so use Open in new tab when needed.
- **Files** — virtual folders and demo files saved in this browser.
- **Notes** — editable notes with automatic local saving.
- **Terminal** — simulated commands: `help`, `clear`, `date`, `whoami`, `ls`, `pwd`, `echo`, `open`, `apps`, `theme`, `uptime`, `calc`, `search`, `joke`, `history`, `reboot`, and `neofetch`.
- **Calculator** — basic arithmetic.
- **Settings** — appearance, wallpaper, focus mode, ambient glow.
- **Snake** — playable keyboard/touch arcade game.
- **To-do** — persistent task list.
- **Calendar** — monthly calendar using your device date.
- **Paint** — canvas drawing with PNG export.
- **Clock** — live clock and countdown timer.
- **Music Lab** — simple Web Audio synth loop and playable note pads.

## Controls
- Click an app icon or use the dock/launcher.
- Drag a window by its title bar; minimize, maximize, and close with the window controls.
- Press **⌘K** (or **Ctrl+K**) to launch apps.
- Press **Esc** to dismiss popovers.
- Press **⌘W** (or **Ctrl+W**) to close the topmost app.
- In Snake, use arrow keys or **WASD**; touch controls are also provided.

## Privacy and limitations
Notes, tasks, preferences, and virtual files are stored in local browser storage on this device. The terminal is simulated and cannot run real shell commands. Files are a virtual workspace, not a view of your device's actual file system. Websites may block embedding; this cannot be bypassed by the app, so open them in a new tab.

## Project files
- `index.html` — desktop markup
- `style.css` — interface, responsive layout, and themes
- `app.js` — window manager, apps, and local persistence
