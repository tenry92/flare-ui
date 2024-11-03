import pkg from '../package.json';

const { config, version } = pkg;

export { version };

/**
 * Prefix used for the custom elements.
 */
export const prefix = config.prefix;

/**
 * @returns Promise that resolves with the next animation frame.
 */
export function animationFrame(): Promise<DOMHighResTimeStamp> {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
}

/**
 * Assert that `value` is not null or undefined and optionally extends `baseClass`.
 */
export function assert<T>(value: T | undefined | null, baseClass?: {new (...params: any[]): any}): T {
  if (value == undefined) {
    throw new Error('assertion failed');
  }

  if (baseClass && !(value instanceof baseClass)) {
    throw new Error(`assertion failed: expected value to be instanceof ${baseClass.name}, ${value} given`);
  }

  return value;
}

/**
 * Escape `<`, `&` and `"` for HTML.
 *
 * @param html Raw HTML input.
 * @returns Escaped output.
 */
export function escapeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

/**
 * Check if `node` is of type `Element`.
 */
export function isElement(node: Node): node is Element {
  return node.nodeType == Node.ELEMENT_NODE;
}
