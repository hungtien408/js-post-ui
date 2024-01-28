export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (!element) return;

  descriptionElement.textContent = text;
}
