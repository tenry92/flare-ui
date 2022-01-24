import html from './navigation.html';

import FlareElement from '../flare-element';
import NavigationItem from './navigation-item';
import { prefix } from '../utils';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Navigation](/_static/generated/widgets/navigation.png)
 */
export default class Navigation extends FlareElement {
  //#region Fields
  /**
   * List of all navigation item elements.
   */
  public get items(): NodeListOf<NavigationItem> {
    return this.querySelectorAll<NavigationItem>(`:scope > ${prefix}navigation-item`);
  }

  /**
   * Active navigation item.
   */
  public get selectedItem(): NavigationItem | null {
    return this.querySelector<NavigationItem>(`:scope > ${prefix}navigation-item[selected]`);
  }
  //#endregion

  public constructor() {
    super({
      template,
    });
  }
}
