// Returns an element's position relative to the full page, not the viewport.
// Used internally by the scroll tracker. You can also use it directly.
import { Scroll } from "../lib/scroll.js";
import { Resize } from "../lib/subs.js";

export function clientRect(element) {
  const rect = element.getBoundingClientRect();
  const scrollY = Scroll.scroll;

  return {
    top: rect.top + scrollY,
    bottom: rect.bottom + scrollY,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height,
    wh: Resize.height,
    ww: Resize.width,
  };
}
