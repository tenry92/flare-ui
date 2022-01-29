import html from './table-column.html';

import { assert } from '../utils';
import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * Column resizing is currently experimental.
 */
const allowResizing = false;

export default class TableColumn extends FlareElement {
  //#region Fields
  #leftSizeGrab: HTMLElement;
  #rightSizeGrab: HTMLElement;
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });

    this.#leftSizeGrab = assert(this.shadowRoot?.querySelector('.size-grab:first-of-type'), HTMLElement);
    this.#rightSizeGrab = assert(this.shadowRoot?.querySelector('.size-grab:last-of-type'), HTMLElement);
  }

  //#region Methods
  protected override ready(): void {
    if (allowResizing) {
      const mouseDownCallbackFactory = (otherColumn: HTMLElement) => {
        return (event: MouseEvent): void => {
          if (event.button != 0) {
            return;
          }

          event.preventDefault();

          const moveCallback = (moveEvent: MouseEvent): void => {
            if ((moveEvent.buttons & 1) == 1) {
              const movement = moveEvent.movementX;

              if (movement != 0) {
                const rect = otherColumn.getBoundingClientRect();

                const newWidth = Math.max(1, rect.width + movement);

                otherColumn.style.width = `${newWidth}px`;
              }
            } else {
              document.removeEventListener('mousemove', moveCallback);
            }
          };

          document.addEventListener('mousemove', moveCallback);
        };
      };

      const previousColumn = this.previousElementSibling as HTMLElement | null;

      if (previousColumn) {
        this.#leftSizeGrab.addEventListener('mousedown', mouseDownCallbackFactory(previousColumn));
      }

      const nextColumn = this.nextElementSibling as HTMLElement | null;

      if (nextColumn) {
        // we only allow resizing of this column if there is a follow-up column
        this.#rightSizeGrab.addEventListener('mousedown', mouseDownCallbackFactory(this));
      }
    }
  }
  //#endregion
}
