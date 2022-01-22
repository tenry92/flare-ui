import html from './button.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Button](/_static/generated/widgets/button.png)
 *
 * The button is an interactive element with a label (text, icon or anything else).
 *
 * @example
 * Simple button with text:
 *
 * ```html
 * <jae-button>Button</jae-button>
 * ```
 *
 * @example
 * Primary button:
 *
 * ```html
 * <jae-button primary>Primary Button</jae-button>
 * ```
 *
 * @emits Event#activate
 *
 * Dispatched when this element is activated by a mouse click or the keyboard.
 */
export default class Button extends JaeElement {
  //#region Static Fields
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
   * Whether this is the primary button (visual only).
   * This is usually used for the main action in dialogs and forms.
   *
   * @reflectsHtmlAttribute primary
   */
  public get primary(): boolean {
    return this.hasAttribute('primary');
  }

  public set primary(value: boolean) {
    if (value) {
      this.setAttribute('primary', 'primary');
    } else {
      this.removeAttribute('primary');
    }
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });
  }
}
