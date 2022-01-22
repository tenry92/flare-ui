import html from './group-box-label.html';

import { prefix } from '../utils';
import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class GroupBoxLabel extends JaeElement {
  public constructor() {
    super({
      template,
    });
  }

  //#region Methods
  protected override ready(): void {
    if (this.parentElement?.tagName == `${prefix.toUpperCase()}GROUP-BOX`) {
      this.slot = 'label';
    }
  }
  //#endregion
}
