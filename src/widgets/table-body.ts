import html from './table-body.html';

import TableRow from './table-row';
import Table from './table';
import { prefix } from '../utils';
import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

export default class TableBody extends FlareElement {
  //#region Fields
  public get columnCount(): number {
    let count = 0;

    this.rows.forEach(row => {
      count = Math.max(count, row.columns.length);
    });

    return count;
  }

  public get rows(): NodeListOf<TableRow> {
    return this.querySelectorAll<TableRow>(`${prefix}table-row`);
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
