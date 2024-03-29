import html from './tab.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class Tab extends FlareElement {
  //#region Fields
  /**
   * @reflectsHtmlAttribute active
   */
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
    });

    this.addEventListener('activate', () => {
      if (!this.active) {
        this.active = true;
      }
    });
  }
}
