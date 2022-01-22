import html from './navigation-item.html';

import JaeElement from '../jae-element';
import Navigation from './navigation';
import { prefix } from '../utils';

const template = document.createElement('template');
template.innerHTML = html;

export default class NavigationItem extends JaeElement {
  //#region Fields
  /**
   * @reflectsHtmlAttribute active
   */
  public get active(): boolean {
    return this.hasAttribute('active');
  }

  public set active(value: boolean) {
    if (value) {
      this.setAttribute('active', 'active');
    } else {
      this.removeAttribute('active');
    }
  }

  public get navigation(): Navigation | null {
    return this.closest(`${prefix}navigation`);
  }
  //#endregion

  public constructor() {
    super({
      template,
      interactive: true,
    });

    this.addEventListener('activate', () => {
      if (!this.active) {
        if (this.navigation) {
          this.navigation.items.forEach(item => item.active = false);
        }

        this.active = true;

        const changeEvent = new Event('change');
        this.dispatchEvent(changeEvent);
      }
    });
  }
}
