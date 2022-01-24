import html from './layout.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class Layout extends FlareElement {
  //#region Fields
  /**
   * @reflectsHtmlAttribute vertical
   */
  public get vertical(): boolean {
    return this.hasAttribute('vertical');
  }

  public set vertical(value: boolean) {
    if (value) {
      this.removeAttribute('horizontal');
      this.setAttribute('vertical', 'vertical');
    } else {
      this.removeAttribute('vertical');
    }
  }

  /**
   * @reflectsHtmlAttribute horizontal
   */
  public get horizontal(): boolean {
    return this.hasAttribute('horizontal');
  }

  public set horizontal(value: boolean) {
    if (value) {
      this.removeAttribute('vertical');
      this.setAttribute('horizontal', 'horizontal');
    } else {
      this.removeAttribute('horizontal');
    }
  }
  //#endregion

  public constructor() {
    super({
      template,
    });
  }
}
