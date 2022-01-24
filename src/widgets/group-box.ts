import html from './group-box.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class GroupBox extends FlareElement {
  public constructor() {
    super({
      template,
    });
  }
}
