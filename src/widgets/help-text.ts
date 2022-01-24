import html from './help-text.html';

import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class HelpText extends FlareElement {
  public constructor() {
    super({
      template,
    });
  }
}
