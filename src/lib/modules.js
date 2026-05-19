// The component system. Same as Core, plus viewport and scroll tracking.
//
// Extra hooks available in Advanced:
//   onView(el, config)   — watch when an element enters/exits the viewport
//   onTrack(el, config)  — get a 0-to-1 scroll progress value for an element
import { Resize } from "./subs.js";
import { Observe } from "./observe.js";
import { Track } from "./track.js";
import { registry } from "../modules/registry.js";

const mountFns = [];
const destroyFns = [];
const pageInFns = [];
const pageOutFns = [];

export function onMount(fn) { mountFns.push(fn); }
export function onDestroy(fn) { destroyFns.push(fn); }
export function onPageIn(fn) { pageInFns.push(fn); }

export function onPageOut(fn, { element } = {}) {
  if (element) {
    pageOutFns.push(async () => {
      const rect = element.getBoundingClientRect();
      const visible = rect.top < Resize.height && rect.bottom > 0;
      return visible ? await fn() : undefined;
    });
  } else {
    pageOutFns.push(fn);
  }
}

/**
 * Watch when an element enters or exits the viewport.
 * Automatically cleans up when the component is destroyed.
 *
 *   onView(el, {
 *     callback: ({ isIn, direction }) => { ... }
 *   });
 */
export function onView(element, config = {}) {
  const observer = new Observe(element, { autoStart: true, ...config });
  onDestroy(() => observer.destroy());
  return observer;
}

/**
 * Track an element's scroll progress from 0 (entering viewport)
 * to 1 (leaving viewport). Great for parallax and scroll-linked effects.
 * Automatically cleans up when the component is destroyed.
 *
 *   onTrack(el, {
 *     callback: (progress) => {
 *       gsap.set(el, { yPercent: (progress - 0.5) * 20 });
 *     }
 *   });
 */
export function onTrack(element, config = {}) {
  const track = new Track(element, config);
  onDestroy(() => track.destroy());
  return track;
}

export function runMount() {
  mountFns.forEach((fn) => fn());
  mountFns.length = 0;
}

export function runDestroy() {
  destroyFns.forEach((fn) => fn());
  destroyFns.length = 0;
}

export async function runPageIn() {
  await Promise.allSettled(pageInFns.map((fn) => fn()));
  pageInFns.length = 0;
}

export async function runPageOut() {
  await Promise.allSettled(pageOutFns.map((fn) => fn()));
  pageOutFns.length = 0;
}

export function createModules(attr = "module") {
  document.querySelectorAll(`[data-${attr}]`).forEach((el) => {
    if (el._moduleInit) return;
    const name = el.dataset[attr];
    const moduleFn = registry[name];
    if (moduleFn) {
      el._moduleInit = true;
      moduleFn(el, el.dataset);
    } else {
      console.warn(`[odyn] No component registered for data-module="${name}"`);
    }
  });
}
