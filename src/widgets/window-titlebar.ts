import html from './window-titlebar.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class WindowTitlebar extends FlareElement {
  public constructor() {
    super({
      template,
    });
  }
}
