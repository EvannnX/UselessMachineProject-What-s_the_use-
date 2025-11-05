# Escape from Use — Asset Notes

This folder hosts visual and audio assets for the interactive dock.

## Audio

- `audio/footsteps.wav`: short foley loop that plays while an overused icon sprints away.
- `audio/overused_scream.wav`: sharp reaction when you hover an exhausted app.
- `audio/overused_sigh.wav`: a weary exhale used both on hover (randomly) and when the icon finally stops.
- `audio/underused_cheer.wav`: enthusiastic chime that fires when an underused app finally gets noticed.
- `audio/noooo-sfx.mp3`: meme “Noooo!” yell triggered when you click an overused app.
- `audio/ksi-yes.mp3`: “Yes Yes Yes” KSI meme cheer triggered by clicking an underused app.

## Logos

SVG logos for the ten default apps live in `assets/images/`. Feel free to swap them with your own art or higher-resolution renders:

- `chrome.svg`
- `figma.svg`
- `slack.svg`
- `vscode.svg`
- `spotify.svg`
- `notion.svg`
- `trello.svg`
- `github.svg`
- `jira.svg`
- `sketch.svg`
- `mac-wallpaper.jpg` — place your preferred classic macOS wallpaper here to sit behind the dock. Any large JPG/PNG works; the CSS scales it to cover the viewport.

If you introduce new characters or alternate states (running, waving, exhausted), update the metadata in `app.js` and extend the CSS so the animations continue to read clearly.
