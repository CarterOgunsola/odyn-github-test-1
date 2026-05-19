// GSAP is loaded from the CDN (see Dependencies panel).
// This file registers plugins and sets default animation values.

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  ease: "expo.out",
  duration: 1.2,
});

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { reduced };
export default gsap;
