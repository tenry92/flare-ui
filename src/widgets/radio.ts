import html from './radio.html';

import { prefix } from '../utils';
import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Radio](/_static/generated/widgets/radio.png)
 *
 * Simple radio buttons with labels:
 *
 * ```html
 * <jae-radio>Option 1</jae-radio>
 * <jae-radio checked>Option 2</jae-radio>
 * ```
 *
 * @emits Event#change
 *
 * Dispatched when the `checked` value was changed upon user action.
 *
 * @htmlPart button The actual radio button.
 * @htmlPart mark The mark (checkmark) within the radio button.
 * @htmlPart label The label part of the widget.
 */
export default class Radio extends JaeElement {
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

  public get optionGroup(): Radio[] {
    if (this.parentElement) {
      return [...this.parentElement.querySelectorAll<Radio>(`:scope > ${prefix}radio`)];
    }

    return [];
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });

    this.addEventListener('activate', () => {
      if (!this.checked) {
        this.optionGroup.forEach(radio => radio.checked = false);
        this.checked = true;

        const changeEvent = new Event('change');
        this.dispatchEvent(changeEvent);
      }
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
