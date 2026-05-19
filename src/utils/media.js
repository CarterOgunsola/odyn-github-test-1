// Media query helpers.

/** True if the user has "reduce motion" enabled in their OS. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True if viewport is 1024px or narrower. */
export const isTabletOrBelow = () =>
  window.matchMedia("(max-width: 1024px)").matches;

/** True if viewport is 768px or narrower. */
export const isMobile = () =>
  window.matchMedia("(max-width: 768px)").matches;
