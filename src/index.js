// Your script starts here.
// Sets up smooth scroll, page transitions, and mounts your components.
import { Scroll } from "./lib/scroll.js";
import { Pages } from "./lib/pages.js";
import { createModules, runMount, runPageIn } from "./lib/modules.js";

createModules();
runPageIn();
runMount();
