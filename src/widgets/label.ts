import html from './label.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class Label extends FlareElement {
  public constructor() {
    super({
      template,
    });
  }
}
