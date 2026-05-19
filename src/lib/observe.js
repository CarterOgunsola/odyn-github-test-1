// Viewport detection using IntersectionObserver.
//
// The ObserverManager shares a single IntersectionObserver across all
// elements with the same config, instead of creating one per element.
// This is a performance optimization — you don't need to think about it,
// just use onView() from lib/modules.js.

class ObserverManager {
  static #instance;
  #groups = [];

  static getInstance() {
    if (!ObserverManager.#instance) {
      ObserverManager.#instance = new ObserverManager();
    }
    return ObserverManager.#instance;
  }

  addElement(element, config, callbacks) {
    this.removeElement(element);

    let group = this.#groups.find(
      (g) => g.config.root === config.root && g.config.rootMargin === config.rootMargin
    );

    if (!group) {
      const observer = new IntersectionObserver(
        (entries) => this.#handle(entries),
        { ...config, threshold: [0] }
      );
      group = { config, observer, elements: new Map() };
      this.#groups.push(group);
    }

    group.elements.set(element, { callbacks, once: config.once || false });
    group.observer.observe(element);
    return group;
  }

  removeElement(element) {
    const group = this.#groups.find((g) => g.elements.has(element));
    if (!group) return;
    group.observer.unobserve(element);
    group.elements.delete(element);
    if (group.elements.size === 0) {
      group.observer.disconnect();
      this.#groups = this.#groups.filter((g) => g !== group);
    }
  }

  #handle(entries) {
    for (const entry of entries) {
      const el = entry.target;
      const group = this.#groups.find((g) => g.elements.has(el));
      if (!group) continue;
      const data = group.elements.get(el);
      if (!data) continue;

      const direction = entry.boundingClientRect.top > 0 ? 1 : -1;
      const payload = { entry, direction, isIn: entry.isIntersecting };

      if (entry.isIntersecting) {
        data.callbacks.isIn?.(payload);
        data.callbacks.callback?.(payload);
        if (data.once) this.removeElement(el);
      } else {
        data.callbacks.isOut?.(payload);
        data.callbacks.callback?.(payload);
      }
    }
  }
}

export class Observe {
  #group;
  inView = false;

  constructor(element, config = {}) {
    this.element = element;
    this.callback = config.callback || (() => {});
    if (config.autoStart) this.start();
  }

  start() {
    this.#group = ObserverManager.getInstance().addElement(
      this.element,
      { root: null, rootMargin: "0px", ...this },
      {
        isIn: () => { this.inView = true; },
        isOut: () => { this.inView = false; },
        callback: this.callback,
      }
    );
  }

  stop() {
    ObserverManager.getInstance().removeElement(this.element);
  }

  destroy() {
    this.stop();
  }
}
