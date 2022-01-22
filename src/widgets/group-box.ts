import html from './group-box.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class GroupBox extends JaeElement {
  public constructor() {
    super({
      template,
    });
  }
}
