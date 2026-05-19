// Reactive state for communication between components.
//
// One component sets a value, others react to the change:
//
//   import state from "../lib/state.js";
//
//   // In your nav component:
//   state.on("MENU_OPEN", (isOpen) => {
//     if (isOpen) showOverlay();
//     else hideOverlay();
//   });
//
//   // In your hamburger component:
//   state.MENU_OPEN = true;   // ← triggers all listeners

class Emitter {
  #events = {};
  on(event, fn) { (this.#events[event] ||= []).push(fn); }
  off(event, fn) { if (this.#events[event]) this.#events[event] = this.#events[event].filter((h) => h !== fn); }
  once(event, fn) { const w = (d) => { fn(d); this.off(event, w); }; this.on(event, w); }
  emit(event, data) { (this.#events[event] || []).forEach((h) => h(data)); }
}

const emitter = new Emitter();
const store = {};

export default new Proxy(store, {
  set(target, prop, value) {
    Reflect.set(target, prop, value);
    emitter.emit(prop.toString(), value);
    return true;
  },
  get(target, prop) {
    if (prop === "on") return emitter.on.bind(emitter);
    if (prop === "once") return emitter.once.bind(emitter);
    if (prop === "off") return emitter.off.bind(emitter);
    return target[prop];
  },
});
