import html from './text-input.html';

import { animationFrame, assert } from '../utils';
import FlareElement from '../flare-element';
import FormControl from './form-control';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * Specifies how a specific text region should be highlighted using CSS rules.
 */
export interface Highlight {
  /**
   * The character offset where to start highlighting.
   */
  start: number;

  /**
   * The character offset where to stop highlighting.
   */
  end: number;

  /**
   * The CSS rules to apply to that region.
   */
  style: Partial<CSSStyleDeclaration>;
}

export default class TextInput extends FlareElement implements FormControl {
  //#region Fields
  /**
   * The actual input element with the `contenteditable` attribute.
   */
  #content: HTMLElement;

  /**
   * The placeholder element.
   */
  #placeholder: HTMLElement;

  /**
   * List of highlights previously set.
   */
  #highlights = [] as Highlight[];

  /**
   * Previous selection range. Used for restoring selection after the inner
   * structure changed due to formatting.
   */
  #previousSelectionRange?: {
    startOffset: number;
    endOffset: number;
  };

  #refreshHighlightScheduled = false;

  public get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  public set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', 'disabled');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * Reflects the `multiline` attribute.
   */
  public get multiline(): boolean {
    return this.hasAttribute('multiline');
  }

  public set multiline(value: boolean) {
    if (value) {
      this.setAttribute('multiline', 'multiline');
    } else {
      this.removeAttribute('multiline');
    }
  }

  /**
   * @initsFromHtmlAttribute value
   */
  public get value(): string {
    const value = this.#content.textContent || '';

    if (value == '\n') {
      return '';
    }

    return value;
  }

  public set value(value: string) {
    if (value != this.#content.textContent) {
      this.#content.textContent = value;

      this.updatePlaceholderHidden();
      this.updateHighlight();
    }
  }

  /**
   * The current placeholder text.
   *
   * @reflectsHtmlAttribute placeholder
   */
  public get placeholder(): string {
    return this.#placeholder.textContent || '';
  }

  public set placeholder(value: string) {
    this.#placeholder.textContent = value;
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
      activatable: false,
      delegatesFocus: true,
    });

    this.#content = assert(this.shadowRoot?.querySelector('#content'), HTMLElement);
    this.#placeholder = assert(this.shadowRoot?.querySelector('[part~="placeholder"]'), HTMLElement);

    this.#content.addEventListener('beforeinput', inputEvent => {
      // todo: improve history support (Ctrl+Z, Ctrl+Y, ...)

      // see https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
      switch (inputEvent.inputType) {
        default: {
          if (/^insert[A-Z]/.test(inputEvent.inputType)) {
            // insertOrderedList, insertLink etc.
            inputEvent.preventDefault();
          }

          if (/^format[A-Z]/.test(inputEvent.inputType)) {
            // formatBold, formatItalic etc.
            inputEvent.preventDefault();
          }

          break;
        }
        case 'insertText':
          break;
        case 'insertFromPaste': {
          inputEvent.preventDefault();

          if (inputEvent.dataTransfer) {
            let plainText = inputEvent.dataTransfer.getData('text/plain');

            if (!this.multiline) {
              plainText = plainText.replace(/[\r\n]+/g, ' ');
            }

            this.insertText(inputEvent, plainText);
          }

          break;
        }
        case 'insertLineBreak':
        case 'insertParagraph': {
          inputEvent.preventDefault();

          console.log('insert new line');

          if (this.multiline) {
            this.insertText(inputEvent, '\n');
          }

          break;
        }
      }
    });

    this.#content.addEventListener('paste', async () => {
      await animationFrame();
      this.updatePlaceholderHidden();
      this.updateHighlight();
    });

    this.#content.addEventListener('input', () => {
      this.updatePlaceholderHidden();
      this.updateHighlight();
    });
  }

  //#region Static Methods
  public static get observedAttributes(): string[] {
    return ['value', 'placeholder'];
  }
  //#endregion

  //#region Methods
  protected override ready(): void {
    this.updatePlaceholderHidden();
    this.updateHighlight();
  }

  /**
   * Set text highlighting.
   *
   * Any previously set highlighting will be discarded.
   *
   * The following example highlights all occurrences of "${...}":
   *
   * ```js
   * const element = document.querySelector('flare-text-input');
   * const highlights = [];
   *
   * const value = this.$refs.input.value;
   * const regExp = /\$\{([^}]+)\}/g;
   *
   * let match;
   *
   * while (match = regExp.exec(value)) {
   *   const [, varName] = match;
   *
   *   highlights.push({
   *     start: match.index,
   *     end: match.index + match[0].length - 1,
   *     style: {
   *       color: 'skyblue',
   *     },
   *   });
   * }
   *
   * element.highlight(highlights);
   * ```
   */
  public highlight(highlights: Iterable<Highlight>): void {
    this.#highlights = [...highlights].sort((a, b) => {
      if (a.start < b.start) {
        return -1;
      }

      if (a.start > b.start) {
        return 1;
      }

      return 0;
    });

    this.updateHighlight();
  }

  /**
   * Update placeholder visibility status.
   */
  private updatePlaceholderHidden(): void {
    this.#placeholder.hidden = this.value != '';
  }

  /**
   * Update text formatting.
   */
  private async updateHighlight(): Promise<void> {
    if (this.#refreshHighlightScheduled) {
      return;
    }

    this.#refreshHighlightScheduled = true;
    await animationFrame();
    this.#refreshHighlightScheduled = false;

    if (!this.supportsSelection()) {
      console.warn('missing support for ShadowRoot.getSelection(); input highlighting disabled');
      return;
    }

    // remember selection since we are about to modify the DOM structure
    this.rememberSelection();

    if (this.#highlights.length > 0) {
      // we have at least 1 highlight
      const source = this.value;
      this.#content.textContent = '';
      let lastOffset = 0;

      for (const highlight of this.#highlights) {
        const start = Math.min(highlight.start, highlight.end);
        const end = Math.max(highlight.start, highlight.end);

        if (start - lastOffset > 0) {
          // unformatted text between highlights
          const node = document.createTextNode(source.substring(lastOffset, start));
          this.#content.append(node);
        }

        const subString = source.substring(start, end + 1);
        const span = document.createElement('span');
        span.textContent = subString;

        for (const [key, value] of Object.entries(highlight.style)) {
          // @ts-expect-error: `key` is of type `string` instead of possible CSS keys
          span.style[key] = value;
        }

        this.#content.append(span);

        lastOffset = end + 1;
      }

      if (lastOffset < source.length) {
        const node = document.createTextNode(source.substring(lastOffset));
        this.#content.append(node);
      }
    } else {
      // no highlights, so just update the text content
      this.#content.textContent = this.#content.textContent || '';
    }

    // restore selection since we modified the DOM structure
    this.restoreSelection();
  }

  public attributeChangedCallback(name: string, oldValue?: string, newValue?: string): void {
    switch (name) {
      case 'value':
        this.value = newValue || '';
        break;
      case 'placeholder':
        this.placeholder = newValue || '';
        break;
    }
  }

  /**
   * Convert a selection range (node and offset within that node) to a plain offset.
   */
  private selectionRangeToOffset(rangeContainer: Node, rangeOffset: number): number {
    if (rangeContainer == this.#content) {
      return rangeOffset;
    }

    if (rangeContainer.parentElement != this.#content) {
      // <div CONTENT> <span> [text node]

      if (rangeContainer.parentElement?.tagName != 'SPAN') {
        throw new Error('unexpected parent element');
      }

      rangeContainer = rangeContainer.parentElement;
    }

    let offset = 0;

    for (const node of this.#content.childNodes) {
      if (node == rangeContainer) {
        offset += rangeOffset;
        break;
      }

      offset += node.textContent?.length || 0;
    }

    return offset;
  }

  /**
   * Convert a plain offset to container node and offset within that container.
   */
  private offsetToSelectionRange(offset: number): {container: Node, offset: number} {
    for (const node of this.#content.childNodes) {
      const textContent = node.textContent || '';

      if (offset <= textContent.length) {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            return {container: node.childNodes[0], offset};
          case Node.TEXT_NODE:
            return {container: node, offset};
          default:
            throw new Error('unexpected node type');
        }
      }

      offset -= textContent.length;
    }

    const lastNode = this.#content.childNodes[this.#content.childNodes.length - 1] as Node | undefined;

    return {
      container: lastNode ?? this.#content,
      offset: (lastNode?.textContent || '').length || 0,
    };
  }

  /**
   * Remember current selection.
   *
   * @see restoreSelection()
   */
  private rememberSelection(): void {
    if (!this.supportsSelection()) {
      return;
    }

    // @ts-expect-error: Method `getSelection` not in declaration of ShadowRoot
    const selection = this.shadowRoot?.getSelection() as Selection;

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      this.#previousSelectionRange = {
        startOffset: this.selectionRangeToOffset(range.startContainer, range.startOffset),
        endOffset: this.selectionRangeToOffset(range.endContainer, range.endOffset),
      };
    }
  }

  /**
   * Restore previous selection.
   *
   * @see rememberSelection()
   */
  private restoreSelection(): void {
    if (!this.#previousSelectionRange) {
      return;
    }

    // @ts-expect-error: Method `getSelection` not in declaration of ShadowRoot
    const selection = this.shadowRoot?.getSelection() as Selection;
    selection.removeAllRanges();

    const range = document.createRange();
    const start = this.offsetToSelectionRange(this.#previousSelectionRange.startOffset);
    const end = this.offsetToSelectionRange(this.#previousSelectionRange.startOffset);
    range.setStart(start.container, start.offset);
    range.setEnd(end.container, end.offset);
    selection.addRange(range);

    this.#previousSelectionRange = undefined;
  }

  private insertText(inputEvent: InputEvent, text: string): void {
    const targetRange = inputEvent.getTargetRanges()[0];

    // a single line break on a multiline element does not cause to actual break it yet
    if (text == '\n' && targetRange.endContainer.textContent?.length == targetRange.endOffset) {
      text = '\n\n';
    }

    const currentText = this.#content.textContent || '';
    const prefix = currentText.slice(0, targetRange.startOffset);
    const suffix = currentText.slice(targetRange.endOffset);
    this.#content.textContent = prefix + text + suffix;

    // @ts-expect-error: Method `getSelection` not in declaration of ShadowRoot
    const newSelection = this.shadowRoot?.getSelection() as Selection;
    newSelection.removeAllRanges();

    const range = document.createRange();
    range.setStart(this.#content.childNodes[0], (prefix + text).length);
    range.setEnd(this.#content.childNodes[0], (prefix + text).length);
    newSelection.addRange(range);

    this.updatePlaceholderHidden();
  }

  private supportsSelection(): boolean {
    const shadowRoot = this.shadowRoot;

    if (!shadowRoot || !('getSelection' in shadowRoot)) {
      return false;
    }

    return true;
  }
  //#endregion
}
