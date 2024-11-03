import html from './checkbox.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Checkbox](/_static/generated/widgets/checkbox.png)
 *
 * Simple checkboxes with labels:
 *
 * ```html
 * <flare-checkbox>Checkbox 1</flare-checkbox>
 * <flare-checkbox checked>Checkbox 2</flare-checkbox>
 * ```
 *
 * @emits Event#change
 *
 * Dispatched when the `checked` value was changed upon user action.
 *
 * @htmlPart checkbox The actual checkbox.
 * @htmlPart mark The checkmark within the checkbox.
 * @htmlPart label The label part of the widget.
 */
export default class Checkbox extends FlareElement {
  //#region Fields
  /**
   * Whether this checkbox is currently checked.
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
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });

    this.addEventListener('activate', () => {
      this.toggle();

      const inputEvent = new Event('input');
      this.dispatchEvent(inputEvent);

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
