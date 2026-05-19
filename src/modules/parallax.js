// Parallax component — scroll-linked vertical offset.
//
// In Webflow:
//   1. Add data-module="parallax" to a wrapper element
//   2. Optionally add data-speed="0.2" to control intensity (default: 0.15)
//   3. The first child element (or one with data-parallax-inner) moves
//
// Example Webflow structure:
//   <div data-module="parallax" data-speed="0.2">
//     <img src="..." />    ← this moves
//   </div>
import { onTrack } from "../lib/modules.js";

export default function (el, dataset) {
  const speed = parseFloat(dataset.speed || "0.15");
  const inner = el.querySelector("[data-parallax-inner]") || el.firstElementChild || el;

  onTrack(el, {
    top: "bottom",
    bottom: "top",
    callback: (progress) => {
      // progress goes from 0 (entering) to 1 (leaving)
      const offset = (progress - 0.5) * speed * 100;
      gsap.set(inner, { yPercent: offset });
    },
  });
}
