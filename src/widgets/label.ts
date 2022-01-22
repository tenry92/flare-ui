import html from './label.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class Label extends JaeElement {
  public constructor() {
    super({
      template,
    });
  }
}
