// Common math functions for animation work.

export function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function map(value, inLow, inHigh, outLow, outHigh) {
  return outLow + ((outHigh - outLow) * (value - inLow)) / (inHigh - inLow);
}

export function clamp(min, max, value) {
  return Math.min(Math.max(value, min), max);
}
