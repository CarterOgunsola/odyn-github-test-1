// Re-initializes Webflow's native interactions after page transitions.
export function resetWebflow() {
  const wf = window.Webflow || [];
  wf.forEach((module) => {
    module.destroy();
    module.ready();
  });
}
