# Escape from Use — Project Playbook

“Escape from Use” is a single-page interactive vignette built for the Useless Machine course. It re-imagines a computer dock whose icons have feelings about how often they are summoned, staging Sara Ahmed’s ideas about use and refusal as a small performance.

## Getting Started

1. Clone or copy the project files.
2. Open `index.html` in any modern desktop browser (Chrome, Edge, Firefox, Safari).
3. Move your cursor toward the icons to provoke their different reactions. Touch devices fall back to a static presentation.

## Behaviour Overview

- **Overused apps** (Chrome, Figma, Slack, VS Code, Spotify) sprout bright cartoon legs, jog away from your pointer, and sigh once they settle in a new resting spot—but they never creep back to the dock.
- **Underused apps** (Notion, Trello, GitHub, Jira, Sketch) raise both arms skyward and wave to catch your attention while inching toward the cursor. The instant you notice them, they freeze and play dead.
- Icons negotiate personal space in real time, so their little performances never overlap or clip through one another.
- Runaway animations now take their time, letting you enjoy each frantic step, while seekers peel off toward the cursor from unique approach angles instead of marching in a single herd.
- Every ten seconds a different icon speaks up in a floating bubble—overused apps beg for rest with one of fifteen exhausted quips, while underused apps plead "use me" in their own anxious voices; hovering any icon triggers an immediate aside.
- Audio cues heighten the drama: overused apps yelp or sigh when you hover them and leave audible footsteps as they flee, while underused apps cheer for attention the moment you notice them.
- Clicking an icon triggers a full vocal reaction—overused apps unleash drawn-out哀叹, while underused apps answer with a triumphant欢呼。
- Motion honours `prefers-reduced-motion` automatically, dampening the animations for sensitive viewers.

## Assets

The dock defaults to coloured gradients with two-letter initials, so it works even without bespoke art. Drop replacement sprites and audio in `assets/` and adjust the metadata in `app.js` if you have character artwork:

- `assets/audio/footsteps.wav` — frantic footsteps when an overused icon bolts.
- `assets/audio/overused_scream.wav` — sharp complaint when you hover an exhausted app.
- `assets/audio/overused_sigh.wav` — a soft, weary exhale after the sprint.
- `assets/audio/noooo-sfx.mp3` — dramatic groan sampled from the classic “Nooo!” meme, played when clicking an overused app.
- `assets/audio/underused_cheer.wav` — cheerful chime fired when an underused app gets attention.
- `assets/audio/ksi-yes.mp3` — the “Yes Yes Yes” KSI cheer triggered when clicking an underused app.
- SVG logos for each of the ten featured apps live in `assets/images/`. Swap in your own artwork or higher-resolution assets as needed.
- Optional PNG/GIF sprites for alternate icon states (running, waving) as outlined in `assets/README.md`.

## Customising the Experience

- Tune behaviour constants (detection radius, speeds, cooldowns, collision radius) near the top of `app.js`.
- Replace `initials` with background images by setting `plate.style.backgroundImage` in `createIcon`.
- Adjust dock styling, typography, and mood via CSS variables in `styles.css`.
- Swap in your favourite classic macOS wallpaper by dropping a file named `mac-wallpaper.jpg` into `assets/images/`.

## Acknowledgements

Inspired by Sara Ahmed’s “What’s the Use?” and the Useless Machine pedagogy. Audio and visual assets are placeholders—please supply licensed material before public exhibition.

## Asset References

- `assets/images/mac-wallpaper.jpg`: Catalina-style wallpaper sourced from WallpaperAccess — https://wallpaperaccess.com/full/17544.jpg
- `assets/audio/noooo-sfx.mp3`: “Noooo!” sample sourced from MyInstants — https://www.myinstants.com/en/instant/noooo-10159/
- `assets/audio/ksi-yes.mp3`: “Yes Yes Yes” KSI sample sourced from MyInstants — https://www.myinstants.com/en/instant/yes-yes-yes-ksi/
- Procedural sound effects (`footsteps.wav`, `overused_scream.wav`, `overused_sigh.wav`, `underused_cheer.wav`) generated in-project with Python’s standard audio tooling — https://docs.python.org/3/library/wave.html

- Yes Sound Effect: https://www.youtube.com/watch?v=R_XM5k-OtmM
- No Sound Effect: https://www.youtube.com/watch?v=tKIKY0CuAKo
