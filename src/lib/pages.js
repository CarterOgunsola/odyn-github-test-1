// Page transitions powered by Taxi.js.
import { Scroll } from "./scroll.js";
import { Resize } from "./subs.js";
import {
  createModules,
  runDestroy,
  runMount,
  runPageOut,
  runPageIn,
} from "./modules.js";
import { resetWebflow } from "../webflow/reset-webflow.js";

class Transition extends taxi.Transition {
  async onLeave({ from, trigger, done }) {
    await Pages.transitionOut();
    done();
  }

  async onEnter({ to, trigger, done }) {
    await Pages.transitionIn();
    done();
  }
}

class _Pages extends taxi.Core {
  constructor() {
    super({
      links: "a:not([target]):not([href^=\\#]):not([data-taxi-ignore])",
      removeOldContent: true,
      allowInterruption: false,
      bypassCache: false,
      transitions: { default: Transition },
    });
  }

  async transitionOut() {
    await runPageOut();
    runDestroy();
    Scroll.toTop();
  }

  async transitionIn() {
    createModules();
    Scroll.resize();
    Resize.update();
    await runPageIn();
    runMount();
    resetWebflow();
  }
}

export const Pages = new _Pages();
