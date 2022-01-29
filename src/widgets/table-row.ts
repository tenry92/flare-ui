import html from './table-row.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export interface SelectEventDetail {
  toggle: boolean; // if ctrl is pressed
  range: boolean; // if shift is pressed; focus does not change
}

export default class TableRow extends FlareElement {
  //#region Fields
  public get columns(): HTMLCollection {
    return this.children;
  }

  public get selected(): boolean {
    return this.hasAttribute('selected');
  }

  public set selected(value: boolean) {
    if (value) {
      this.setAttribute('selected', 'selected');
    } else {
      this.removeAttribute('selected');
    }
  }

  public get active(): boolean {
    return this.hasAttribute('active');
  }

  public set active(value: boolean) {
    if (value) {
      this.setAttribute('active', 'active');
    } else {
      this.removeAttribute('active');
    }
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
      activatable: true,
      activateWithDoubleClick: true,
    });

    this.addEventListener('click', clickEvent => {
      const detail: SelectEventDetail = {
        toggle: clickEvent.ctrlKey,
        range: clickEvent.shiftKey,
      };

      const selectEvent = new CustomEvent('select', {
        detail,
        bubbles: true,
        cancelable: true,
        composed: true, // leave shadow dom
      });

      this.dispatchEvent(selectEvent);
    });
  }
}
