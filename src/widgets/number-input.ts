import html from './number-input.html';

import TextInput from './text-input';
import Stepper from './stepper';
import FormControl from './form-control';
import { assert, prefix } from '../utils';
import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class NumberInput extends JaeElement implements FormControl {
  //#region Fields
  #textInput: TextInput;
  #stepper: Stepper;

  #lastNumberValue = 0;

  /**
   * @initsFromHtmlAttribute value
   */
  public get value(): string {
    return this.numberValue.toString();
  }

  public set value(value: string) {
    this.numberValue = parseFloat(value);
  }

  /**
   * The current placeholder text.
   *
   * @reflectsHtmlAttribute placeholder
   */
  public get placeholder(): string {
    return this.#textInput.placeholder;
  }

  public set placeholder(value: string) {
    // initially #textInput is instanceof HTMLElement
    if (this.#textInput instanceof TextInput) {
      this.#textInput.placeholder = value;
    } else {
      window.requestAnimationFrame(() => {
        this.#textInput.placeholder = value;
      });
    }
  }

  /**
   * The current numeric value.
   */
  public get numberValue(): number {
    const stringValue = this.#textInput.value;

    const number = parseFloat(stringValue);

    if (!Number.isFinite(number)) {
      return this.#lastNumberValue;
    }

    this.#lastNumberValue = number;

    return number;
  }

  public set numberValue(value: number) {
    if (!Number.isFinite(value)) {
      value = 0;
    }

    this.#lastNumberValue = value;

    // initially #textInput is instanceof HTMLElement
    if (this.#textInput instanceof TextInput) {
      this.#textInput.value = value.toString();
    } else {
      window.requestAnimationFrame(() => {
        this.#textInput.value = value.toString();
      });
    }
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
      activatable: false,
      delegatesFocus: true,
    });

    this.#textInput = assert(this.shadowRoot?.querySelector(`${prefix}text-input`), HTMLElement);
    this.#stepper = assert(this.shadowRoot?.querySelector(`${prefix}stepper`), HTMLElement);

    this.#stepper.addEventListener('stepup', () => {
      ++this.numberValue;
    });

    this.#stepper.addEventListener('stepdown', () => {
      --this.numberValue;
    });

    this.addEventListener('wheel', event => {
      event.preventDefault();

      if (event.deltaY < 0) {
        ++this.numberValue;
      } else if (event.deltaY > 0) {
        --this.numberValue;
      }
    }, { passive: false });
  }

  //#region Static Methods
  public static get observedAttributes(): string[] {
    return ['value', 'placeholder'];
  }
  //#endregion

  //#region Methods
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
  //#endregion
}
