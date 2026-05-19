// Scroll progress tracker.
// Gives you a value from 0 to 1 as an element scrolls through the viewport.
// Used by the onTrack hook and the parallax component.
import { Observe } from "./observe.js";
import { Scroll } from "./scroll.js";
import { Resize } from "./subs.js";
import { clamp, map } from "../utils/math.js";
import { clientRect } from "../utils/client-rect.js";

export class Track extends Observe {
  value = 0;
  #scrollUnsub;
  #resizeUnsub;

  constructor(element, config = {}) {
    super(element, { autoStart: true, once: false });
    this.element = element;
    this.config = {
      bounds: [0, 1],
      top: "bottom",     // start tracking when element top hits viewport bottom
      bottom: "top",     // stop tracking when element bottom hits viewport top
      callback: undefined,
      ...config,
    };

    this.#computeBounds();
    this.#scrollUnsub = Scroll.add(() => this.#onScroll());
    this.#resizeUnsub = Resize.add(() => {
      this.#computeBounds();
      this.#onScroll();
    });
    this.#onScroll();
  }

  #computeBounds() {
    const rect = clientRect(this.element);
    const wh = Resize.height;
    const center = wh / 2;

    this.bounds = {
      top: rect.top - (this.config.top === "center" ? center : this.config.top === "bottom" ? wh : 0),
      bottom: rect.bottom - (this.config.bottom === "center" ? center : this.config.bottom === "bottom" ? wh : 0),
    };
  }

  #onScroll() {
    if (!this.inView) return;
    this.value = clamp(
      0, 1,
      map(Scroll.scroll, this.bounds.top, this.bounds.bottom, this.config.bounds[0], this.config.bounds[1])
    );
    this.config.callback?.(this.value);
  }

  destroy() {
    this.config.callback = undefined;
    this.#scrollUnsub?.();
    this.#resizeUnsub?.();
    super.destroy();
  }
}
