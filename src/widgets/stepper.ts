import html from './stepper.html';

import Button from './button';
import FlareElement from '../flare-element';
import { assert } from '../utils';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * @emits Event#stepup
 * @emits Event#stepdown
 */
export default class Stepper extends FlareElement {
  //#region Fields
  #upButton: Button;
  #downButton: Button;
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
      activatable: false,
    });

    this.#upButton = assert(this.shadowRoot?.querySelector('[part~="up"]'), HTMLElement);
    this.#downButton = assert(this.shadowRoot?.querySelector('[part~="down"]'), HTMLElement);

    this.addEventListener('keydown', event => {
      switch (event.code) {
        case 'ArrowUp':
          event.preventDefault();
          this.#upButton.focus();
          this.dispatchStepEvent('stepup');
          break;
        case 'ArrowDown':{
          event.preventDefault();
          this.#downButton.focus();
          this.dispatchStepEvent('stepdown');
          break;
        }
      }
    });

    this.addEventListener('wheel', event => {
      event.preventDefault();

      if (event.deltaY < 0) {
        this.dispatchStepEvent('stepup');
      } else if (event.deltaY > 0) {
        this.dispatchStepEvent('stepdown');
      }
    }, { passive: false });

    this.#upButton.addEventListener('activate', () => {
      this.dispatchStepEvent('stepup');
    });

    this.#downButton.addEventListener('activate', () => {
      this.dispatchStepEvent('stepdown');
    });
  }

  //#region Methods
  private dispatchStepEvent(eventName: string): void {
    const stepEvent = new Event(eventName, {
      bubbles: false,
      cancelable: true,
      composed: true,
    });

    this.dispatchEvent(stepEvent);
  }
  //#endregion
}
