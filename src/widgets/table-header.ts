import html from './table-header.html';

import Table from './table';
import { prefix } from '../utils';
import JaeElement from '../jae-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class TableHeader extends JaeElement {
  //#region Fields
  public get columns(): HTMLCollection {
    return this.children;
  }

  public get table(): Table | null {
    return this.closest<Table>(`${prefix}table`);
  }
  //#endregion

  public constructor() {
    super({
      template,
    });
  }

  //#region Methods
  protected override ready(): void {
    if (this.table) {
      this.table.configureColumnWidths();
    }
  }
  //#endregion
}
