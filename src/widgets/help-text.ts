import html from './help-text.html';

import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class HelpText extends JaeElement {
  public constructor() {
    super({
      template,
    });
  }
}
