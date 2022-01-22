import html from './window-content.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class WindowContent extends JaeElement {
  public constructor() {
    super({
      template,
    });
  }
}
