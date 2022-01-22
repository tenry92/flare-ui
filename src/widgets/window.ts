import html from './window.html';

import WindowTitlebar from './window-titlebar';
import WindowContent from './window-content';
import { assert, prefix } from '../utils';
import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class Window extends JaeElement {
  //#region Fields
  #titlebar?: WindowTitlebar;
  #contents?: WindowContent;

  #topResize: NodeListOf<HTMLElement>;
  #rightResize: NodeListOf<HTMLElement>;
  #bottomResize: NodeListOf<HTMLElement>;
  #leftResize: NodeListOf<HTMLElement>;
  //#endregion

  public constructor() {
    super({
      template,
    });

    this.#topResize = assert(this.shadowRoot?.querySelectorAll('.top.resize'), NodeList);
    this.#rightResize = assert(this.shadowRoot?.querySelectorAll('.right.resize'), NodeList);
    this.#bottomResize = assert(this.shadowRoot?.querySelectorAll('.bottom.resize'), NodeList);
    this.#leftResize = assert(this.shadowRoot?.querySelectorAll('.left.resize'), NodeList);
  }

  //#region Methods
  protected override ready(): void {
    this.#titlebar = this.querySelector(`${prefix}window-titlebar`) || undefined;
    this.#contents = this.querySelector(`${prefix}window-content`) || undefined;

    if (this.#titlebar) {
      this.#titlebar.addEventListener('mousedown', mouseEvent => {
        if (mouseEvent.button != 0) {
          return;
        }

        mouseEvent.preventDefault();

        const moveCallback = (moveEvent: MouseEvent): void => {
          if ((moveEvent.buttons & 1) == 1) {
            const rect = this.getBoundingClientRect();

            this.style.left = `${rect.left + moveEvent.movementX}px`;
            this.style.top = `${rect.top + moveEvent.movementY}px`;
          } else {
            document.removeEventListener('mousemove', moveCallback);
          }
        };

        document.addEventListener('mousemove', moveCallback);
      });
    }

    if (!this.#contents) {
      return;
    }

    const contents = this.#contents;

    const moveFactory = (direction: 'top' | 'left' | 'right' | 'bottom'): (moveEvent: MouseEvent) => void => {
      const multiplier = ['top', 'left'].includes(direction) ? 1 : -1;
      const movement = ['top', 'bottom'].includes(direction) ? 'movementY' : 'movementX';
      const widthOrHeight = movement == 'movementX' ? 'width' : 'height';
      const minWidthOrHeight = movement == 'movementX' ? 'minWidth' : 'minHeight';

      const moveCallback = (moveEvent: MouseEvent): void => {
        if ((moveEvent.buttons & 1) == 1) {
          const rect = contents.getBoundingClientRect();
          const newSize = Math.max(1, rect[widthOrHeight] - moveEvent[movement] * multiplier);
          contents.style[minWidthOrHeight] = `${newSize}px`;

          const newRect = contents.getBoundingClientRect();
          const delta = newRect[widthOrHeight] - rect[widthOrHeight];

          if (['top', 'left'].includes(direction)) {
            // if top/left is resized, also  move
            const outerRect = this.getBoundingClientRect();
            this.style[direction] = `${outerRect[direction] - delta}px`;
          }
        } else {
          document.removeEventListener('mousemove', moveCallback);
        }
      };

      return moveCallback;
    };

    const downFactory = (direction: 'top' | 'left' | 'right' | 'bottom') => {
      return (mouseEvent: MouseEvent): void => {
        if (mouseEvent.button != 0) {
          return;
        }

        mouseEvent.preventDefault();

        document.addEventListener('mousemove', moveFactory(direction));
      };
    };

    this.#topResize.forEach(resize => resize.addEventListener('mousedown', downFactory('top')));
    this.#leftResize.forEach(resize => resize.addEventListener('mousedown', downFactory('left')));
    this.#rightResize.forEach(resize => resize.addEventListener('mousedown', downFactory('right')));
    this.#bottomResize.forEach(resize => resize.addEventListener('mousedown', downFactory('bottom')));
  }
  //#endregion
}
