import html from './dropdown.html';

import FormControl from './form-control';
import Option from './option';
import { assert, prefix } from '../utils';
import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Dropdown](/_static/generated/widgets/dropdown.png)
 *
 * @example
 *
 * ```html
 * <flare-dropdown>
 *   <flare-option value="s" selected>Seconds</flare-option>
 *   <flare-option value="m">Minutes</flare-option>
 *   <flare-option value="h">Hours</flare-option>
 * </flare-dropdown>
 * ```
 */
export default class Dropdown extends FlareElement implements FormControl {
  //#region Static Fields
  /**
   * Invisible element covering the whole viewport.
   *
   * This enables clicking outside of the dropdown for closing it without
   * accidentally clicking any other widget.
   *
   * Only set while any dropdown is open.
   */
  static #overlay?: HTMLElement;
  //#endregion

  //#region Fields
  #label: HTMLElement;
  #menu: HTMLElement;
  #keydownListener?: (keyEvent: KeyboardEvent) => void;

  /**
   * The current selected option's value or empty string if none.
   *
   * @initsFromHtmlAttribute value
   */
  public get value(): string {
    const selectedOption = this.selectedOptions[0];

    if (selectedOption) {
      return selectedOption.value;
    }

    return '';
  }

  public set value(value: string) {
    [...this.options].forEach(option => {
      option.selected = option.value == value;
    });

    this.updateLabel();
  }

  /**
   * Whether the menu is currently open.
   */
  public get open(): boolean {
    return this.hasState('open');
  }

  public set open(value: boolean) {
    if (value == this.open) {
      return;
    }

    if (value) {
      this.addState('open');

      const rect = this.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const popupRect = this.#menu.getBoundingClientRect();

      if (popupRect.height + 20 < spaceBelow) {
        this.addState('dropdown');
        this.deleteState('dropup');

        this.#menu.style.maxHeight = `${spaceBelow - 20}px`;
      } else {
        this.addState('dropup');
        this.deleteState('dropdown');

        this.#menu.style.maxHeight = `${spaceAbove - 20}px`;
      }

      if (!Dropdown.#overlay) {
        const overlay = Dropdown.#overlay = document.body.appendChild(document.createElement('div'));
        overlay.style.background = 'transparent';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';

        overlay.addEventListener('click', event => {
          if (event.button == 0) {
            event.preventDefault();
            this.open = false;
          }
        });
      }

      this.#keydownListener = (keyEvent): void => {
        switch (keyEvent.code) {
          case 'ArrowUp':
            keyEvent.preventDefault();
            this.focusPreviousOption();
            break;
          case 'ArrowDown':
            keyEvent.preventDefault();
            this.focusNextOption();
            break;
          case 'Enter': {
            keyEvent.preventDefault();
            const focusedOption = this.querySelector<Option>(`:scope > ${prefix}option:focus`);

            if (focusedOption) {
              this.value = focusedOption.value;
              this.open = false;
            }

            break;
          }
          case 'Escape': {
            this.open = false;
            break;
          }
          case 'Home': {
            keyEvent.preventDefault();
            const firstOption = this.querySelector<Option>(`:scope > ${prefix}option:first-of-type`)

            if (firstOption) {
              firstOption.focus();
            }

            break;
          }
          case 'End': {
            keyEvent.preventDefault();
            const lastOption = this.querySelector<Option>(`:scope > ${prefix}option:last-of-type`)

            if (lastOption) {
              lastOption.focus();
            }

            break;
          }
        }
      };

      this.addEventListener('keydown', this.#keydownListener);

      this.focusSelectedOption();
    } else {
      if (this.#keydownListener) {
        this.removeEventListener('keydown', this.#keydownListener);
      }

      if (Dropdown.#overlay) {
        Dropdown.#overlay.parentElement?.removeChild(Dropdown.#overlay);
        Dropdown.#overlay = undefined;
        this.focus();
      }

      this.deleteState('open');
    }
  }

  /**
   * List of all option elements.
   */
  public get options(): NodeListOf<Option> {
    return this.querySelectorAll<Option>(`${prefix}option`);
  }

  /**
   * List of all selected option elements.
   */
  public get selectedOptions(): NodeListOf<Option> {
    return this.querySelectorAll<Option>(`${prefix}option[selected]`);
  }

  /**
   * The currently selected option index (starting at 0) or -1 for none.
   */
  public get selectedIndex(): number {
    return [...this.options].indexOf(this.selectedOptions[0]);
  }

  public set selectedIndex(value: number) {
    [...this.options].forEach((option, index) => {
      option.selected = index == value;
    });

    this.updateLabel();
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });

    this.#label = assert(this.shadowRoot?.querySelector('[part~="label"]'), HTMLElement);
    this.#menu = assert(this.shadowRoot?.querySelector('[part~="menu"]'), HTMLElement);

    this.addEventListener('activate', () => {
      this.open = !this.open;
    });

    this.#menu.addEventListener('click', event => {
      if (event.target instanceof Option) {
        this.value = event.target.value;

        const changeEvent = new Event('change', {
          bubbles: true,
          cancelable: true,
          composed: true, // leave shadow dom
        });

        this.dispatchEvent(changeEvent);
      }
    });

    this.addEventListener('wheel', event => {
      event.preventDefault();

      if (event.deltaY < 0) {
        this.selectPreviousOption();
      } else if (event.deltaY > 0) {
        this.selectNextOption();
      }
    }, { passive: false });

    this.addEventListener('keypress', keyEvent => {
      if (keyEvent.code == 'Enter') {
        keyEvent.preventDefault();
        this.open = true;
      }
    });

    requestAnimationFrame(() => {
      this.updateLabel();
    });
  }

  //#region Static Methods
  public static get observedAttributes(): string[] {
    return ['value'];
  }
  //#endregion

  //#region Methods
  private updateLabel(): void {
    const selectedOption = this.selectedOptions[0];

    this.#label.textContent = selectedOption?.textContent || '';
  }

  private selectPreviousOption(): void {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
  }

  private selectNextOption(): void {
    this.selectedIndex = Math.min(this.options.length - 1, this.selectedIndex + 1);
  }

  private focusPreviousOption(): void {
    const focusedOption = this.querySelector<Option>(`:scope > ${prefix}option:focus`);

    if (focusedOption) {
      if (focusedOption.previousElementSibling && focusedOption.previousElementSibling instanceof HTMLElement) {
        focusedOption.previousElementSibling.focus();
      } else {
        const firstOption = this.querySelector<Option>(`:scope > ${prefix}option:last-of-type`);

        if (firstOption) {
          firstOption.focus();
        }
      }
    }
  }

  private focusNextOption(): void {
    const focusedOption = this.querySelector<Option>(`:scope > ${prefix}option:focus`);

    if (focusedOption) {
      if (focusedOption.nextElementSibling && focusedOption.nextElementSibling instanceof HTMLElement) {
        focusedOption.nextElementSibling.focus();
      } else {
        const firstOption = this.querySelector<Option>(`:scope > ${prefix}option:first-of-type`);

        if (firstOption) {
          firstOption.focus();
        }
      }
    }
  }

  public attributeChangedCallback(name: string, oldValue?: string, newValue?: string): void {
    switch (name) {
      case 'value':
        this.value = newValue || '';
        break;
    }
  }

  private focusSelectedOption(): void {
    if (this.selectedOptions.length > 0) {
      this.selectedOptions[0].focus();
    }
  }
  //#endregion
}
