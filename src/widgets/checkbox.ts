import html from './checkbox.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Checkbox](/_static/generated/widgets/checkbox.png)
 *
 * Simple checkboxes with labels:
 *
 * ```html
 * <jae-checkbox>Checkbox 1</jae-checkbox>
 * <jae-checkbox checked>Checkbox 2</jae-checkbox>
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
export default class Checkbox extends JaeElement {
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
