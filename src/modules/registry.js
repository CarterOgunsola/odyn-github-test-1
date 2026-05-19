// Register your components here.
// Import each module and add it to the registry object.
// The key must match the data-module value in your Webflow HTML.
//
// Use simple names (hero, nav, slider) so the key works as both
// a JS identifier and an HTML attribute value.
// If you need hyphens, quote the key: "scroll-reveal": scrollReveal
import example from "./example.js";
import parallax from "./parallax.js";

export const registry = {
  example,
  parallax,
  // hero,
  // nav,
  // slider,
};
