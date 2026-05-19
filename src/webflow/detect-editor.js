// Detects the Webflow Editor. You don't need to touch this file.
export function handleEditor(callback) {
  const check = () => {
    const first = document.body.firstElementChild;
    return first instanceof HTMLElement &&
      first.classList.contains("w-editor-publish-node");
  };

  let previous = check();
  if (callback) callback(previous);

  new MutationObserver(() => {
    const current = check();
    if (current !== previous) {
      previous = current;
      if (callback) callback(current);
    }
  }).observe(document.body, { childList: true });
}
