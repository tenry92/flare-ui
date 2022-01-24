import html from './tabbar.html';

import Tab from './tab';
import { prefix } from '../utils';
import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Tabbar](/_static/generated/widgets/tabs.png)
 */
export default class Tabbar extends FlareElement {
  //#region Fields
  public get tabs(): Tab[] {
    return [...this.children].filter(child => child.matches(`${prefix}tab`)) as Tab[];
  }
  //#endregion

  public constructor() {
    super({
      template,
    });
  }

  //#region Methods
  protected override ready(): void {
    this.tabs.forEach(tab => {
      tab.addEventListener('activate', activateEvent => {
        for (const otherTab of this.tabs) {
          if (otherTab == activateEvent.target) {
            continue;
          }

          otherTab.active = false;
        }
      });
    });
  }
  //#endregion
}
