# Eats with Pete — Walk the Street

Interactive scroll-driven "walk the street" landing page for Eats with Pete.

## Structure

```
index.html            Page markup only
css/
  style.css           All styling
js/
  early-init.js        Tiny script that must run first (disables browser scroll
                        restoration so the page always reloads at the logo)
  main.js              All interactive/animation/audio logic
assets/
  images/               Every PNG/JPG used by the page (background scene,
                        walk-cycle frames, dance frames, point-gesture frames,
                        carrot-peddler frames, cart prop, grain overlay texture)
  audio/                All sound effects + ambience track (mp3)
```

## Why this layout

The original build had every image and sound embedded as base64 inside a single
16MB HTML file. That's heavy to open, diff, or edit — any tiny tweak meant
reloading the whole blob. This version keeps the same page/behavior but:

- `index.html` is just markup (~80 lines) and links to `css/style.css` and
  `js/main.js`/`js/early-init.js`.
- Every image/audio asset lives as its own real file under `assets/`, named
  by what it is (e.g. `walk_07.png`, `handsup_22.png`, `ambience_sound.mp3`).
- Editing a single frame, sound, or style rule only touches that one small
  file instead of the entire page.

## Editing tips

- **Swap an image or sound**: just replace the file in `assets/` with a new
  one of the same name (same filename = no code changes needed).
- **Add/remove animation frames**: edit the `WALK_FRAMES`, `HANDSUP_FRAMES`,
  `DISCO_FRAMES`, `JAZZHANDS_FRAMES`, `POINT_BG_FRAMES`, `POINT_FG_FRAMES`,
  `CARROT_FRAMES`, or `BANANA_STAND_FRAMES` arrays near the top of
  `js/main.js` — each is just a list of paths into `assets/images/`.
- **Tweak layout/colors**: everything is in `css/style.css`.
- **Tweak walk speed, scroll behavior, Pete's positioning, etc.**: all in
  `js/main.js`.

## Running locally

Any static file server works, e.g.:

```
npx serve .
```

or Python:

```
python3 -m http.server
```

Opening `index.html` directly via `file://` also works for quick checks, but
a local server is recommended since some browsers restrict autoplay/audio
behavior differently on `file://` URLs.
