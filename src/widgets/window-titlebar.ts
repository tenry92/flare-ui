import html from './window-titlebar.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class WindowTitlebar extends JaeElement {
  public constructor() {
    super({
      template,
    });
  }
}
