import html from './switch.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Switch](/_static/generated/widgets/switch.png)
 *
 * Toggle switches with labels:
 *
 * ```html
 * <jae-switch>Switch 1</jae-switch>
 * <jae-switch checked>Switch 2</jae-switch>
 * ```
 *
 * @emits Event#change
 *
 * Dispatched when the `checked` value was changed upon user action.
 */
export default class Switch extends JaeElement {
  //#region Fields
  /**
   * Whether this switch is currently checked.
   *
   * @reflectsHtmlAttribute checked
   */
  public get checked(): boolean {
    return this.hasAttribute('checked');
  }

  public set checked(value: boolean) {
    if (value) {
      this.setAttribute('checked', 'checked');
    } else {
      this.removeAttribute('checked');
    }
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });

    this.addEventListener('activate', () => {
      this.toggle();

      const changeEvent = new Event('change');
      this.dispatchEvent(changeEvent);
    });
  }

  //#region Methods
  /**
   * Toggle the `checked` attribute.
   */
  public toggle(): void {
    this.checked = !this.checked;
  }
  //#endregion
}
