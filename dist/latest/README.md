# Odyn Starter (Full)

Everything in the Core starter, plus tools for scroll-driven
interactions and cross-component communication.

Based on the open-source Webflow development setup by
**Federico Valla** at [github.com/vallafederico/webflow-dev-setup](https://github.com/vallafederico/webflow-dev-setup).
Adapted for Odyn's editor and deployment pipeline.

---

## What's added over Core

### Viewport detection: `onView`

Know when an element enters or exits the viewport:

```javascript
import { onView } from "../lib/modules.js";

onView(el, {
  callback: ({ isIn, direction }) => {
    if (isIn) el.classList.add("in-view");
    else el.classList.remove("in-view");
  },
});
```

Uses a shared IntersectionObserver under the hood. Even with
dozens of elements, only a single observer runs per config.
Automatically cleans up when the component is destroyed.

### Scroll progress: `onTrack`

Get a 0-to-1 value as an element scrolls through the viewport:

```javascript
import { onTrack } from "../lib/modules.js";

onTrack(el, {
  callback: (progress) => {
    // progress: 0 when entering, 1 when leaving
    gsap.set(el, { yPercent: (progress - 0.5) * 20 });
  },
});
```

This powers the included parallax component. You can use it for
any scroll-linked effect: opacity fades, horizontal movement,
scale, rotation, color shifts. Anything that should respond
to scroll position.

### Reactive state

Components can talk to each other without importing each other:

```javascript
import state from "../lib/state.js";

// In your hamburger component:
state.MENU_OPEN = true;

// In your nav overlay component (a completely separate file):
state.on("MENU_OPEN", (isOpen) => {
  if (isOpen) showOverlay();
  else hideOverlay();
});
```

State persists across page transitions. Listeners don't.
Register them in `onMount` so they're set up fresh on each page.

### Media queries

```javascript
import { isMobile, prefersReducedMotion } from "../utils/media.js";

if (prefersReducedMotion()) {
  // Skip complex animations
  gsap.set(el, { autoAlpha: 1 });
  return;
}

if (isMobile()) {
  // Simpler animation on phones
}
```

## Page transitions

This starter includes Taxi.js for seamless page-to-page navigation.
For it to work, your Webflow pages need this HTML structure:

```html
<div class="page_wrap">

  <!-- Fixed elements live OUTSIDE the taxi view -->
  <nav class="nav">...</nav>

  <!-- Taxi container -->
  <main data-taxi>

    <!-- This content gets swapped on each navigation -->
    <div data-taxi-view>
      <div class="page_content">
        <section data-module="hero">...</section>
        <section data-module="parallax" data-speed="0.2">
          <img src="..." />
        </section>
      </div>
    </div>

  </main>

  <footer class="footer">...</footer>
</div>
```

- `data-taxi` is the container Taxi.js watches
- `data-taxi-view` is the content that gets replaced per page
- Everything outside the view (nav, footer) persists between pages

Every page needs the same wrapper structure. Skip transitions on
any link with `data-taxi-ignore`. See the
[Taxi.js documentation](https://taxi.js.org/) for more.

## Included components

- **example** entrance/exit animations + viewport detection
- **parallax** scroll-linked vertical offset via `data-speed`

## All files

| File | What it does |
|------|-------------|
| `index.js` | Boots everything |
| `lib/gsap.js` | GSAP defaults + ScrollTrigger |
| `lib/scroll.js` | Lenis smooth scroll |
| `lib/subs.js` | Shared Raf and Resize events |
| `lib/modules.js` | Component system + all hooks |
| `modules/registry.js` | Maps data-module names to components |
| `lib/pages.js` | Page transitions (Taxi.js) |
| `lib/observe.js` | Shared IntersectionObserver |
| `lib/track.js` | Scroll progress tracker |
| `lib/state.js` | Reactive cross-component state |
| `webflow/detect-editor.js` | Disables Lenis in the Editor |
| `webflow/reset-webflow.js` | Re-inits Webflow after transitions |
| `modules/example.js` | Example component |
| `modules/parallax.js` | Parallax component |
| `utils/math.js` | lerp, damp, map, clamp |
| `utils/client-rect.js` | Scroll-aware bounding rect |
| `utils/media.js` | Breakpoint + reduced motion helpers |
| `style.css` | Opt-in hide for animated entrances |
