// Smooth scroll powered by Lenis, synced to GSAP's animation loop.
// Automatically disables inside the Webflow Editor.
import { handleEditor } from "../webflow/detect-editor.js";

const SCROLL_CONFIG = {
  lerp: 0.1,
  smoothWheel: true,
  touchMultiplier: 2,
};

class _Scroll extends Lenis {
  #subscribers = [];

  constructor() {
    super(SCROLL_CONFIG);
    gsap.ticker.add((time) => this.raf(time * 1000));
    this.on("scroll", (data) => this.#notify(data));
  }

  add(fn, priority = 0) {
    const id = Symbol();
    const entry = { fn, priority, id };
    const index = this.#subscribers.findIndex((s) => s.priority > priority);
    if (index === -1) this.#subscribers.push(entry);
    else this.#subscribers.splice(index, 0, entry);
    return () => {
      this.#subscribers = this.#subscribers.filter((s) => s.id !== id);
    };
  }

  #notify(data) {
    for (const sub of this.#subscribers) sub.fn(data);
  }

  toTop() {
    this.scrollTo(0, { immediate: true });
  }
}

export const Scroll = new _Scroll();

handleEditor((isEditor) => {
  if (isEditor) Scroll.destroy();
  else Scroll.start();
});
