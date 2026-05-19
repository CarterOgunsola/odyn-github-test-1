// Example component with viewport detection.
// In Webflow, add data-module="example" to any element.
import { onMount, onDestroy, onPageIn, onPageOut, onView } from "../lib/modules.js";

export default function (el, dataset) {
  let tl;

  onPageIn(async () => {
    tl = gsap.timeline();
    tl.from(el, { autoAlpha: 0, y: 30, duration: 0.8, ease: "expo.out" });
    await tl;
  });

  onPageOut(async () => {
    await gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
  }, { element: el });

  onMount(() => {
    // Watch when this element enters or exits the viewport
    onView(el, {
      callback: ({ isIn, direction }) => {
        // isIn: true when visible, false when not
        // direction: 1 = scrolling down, -1 = scrolling up
      },
    });
  });

  onDestroy(() => {
    if (tl) tl.kill();
  });
}
