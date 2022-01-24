import html from './window-content.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class WindowContent extends FlareElement {
  public constructor() {
    super({
      template,
    });
  }
}
