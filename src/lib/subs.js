// Shared event buses for animation frames (Raf) and window resize (Resize).

class Subscribable {
  #subscribers = [];

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

  notify(data) {
    for (const sub of this.#subscribers) sub.fn(data);
  }
}

class _Raf extends Subscribable {
  deltaTime = 0;
  constructor() {
    super();
    gsap.ticker.add((time, deltaTime) => {
      this.deltaTime = deltaTime;
      this.notify({ time: time * 0.01, deltaTime });
    });
  }
}

class _Resize extends Subscribable {
  width = window.innerWidth;
  height = window.innerHeight;
  #timeout = null;

  constructor() {
    super();
    window.addEventListener("resize", () => this.#debounce());
  }

  #debounce() {
    if (this.#timeout) clearTimeout(this.#timeout);
    this.#timeout = setTimeout(() => this.update(), 100);
  }

  update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w !== this.width || h !== this.height) {
      this.width = w;
      this.height = h;
      this.notify({ width: w, height: h });
    }
  }
}

export const Raf = new _Raf();
export const Resize = new _Resize();
