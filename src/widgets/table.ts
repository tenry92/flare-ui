import html from './table.html';

import TableBody from './table-body';
import TableHeader from './table-header';
import TableRow, { SelectEventDetail } from './table-row';
import { prefix } from '../utils';
import FlareElement from '../flare-element';

const template = document.createElement('template');
template.innerHTML = html;

/**
 * ![Table](/_static/generated/widgets/table.png)
 *
 * @example
 *
 * ```html
 * <flare-table>
 *   <flare-table-header>
 *     <flare-table-column>Header 1</flare-table-column>
 *     <flare-table-column>Header 2</flare-table-column>
 *     <flare-table-column>Header 3</flare-table-column>
 *   </flare-table-header>
 *   <flare-table-body>
 *     <flare-table-row>
 *       <flare-table-column>Item 1</flare-table-column>
 *       <flare-table-column>Item 2</flare-table-column>
 *       <flare-table-column>Item 3</flare-table-column>
 *     </flare-table-row>
 *     <flare-table-row>
 *       <flare-table-column>Item 4</flare-table-column>
 *       <flare-table-column>Item 5</flare-table-column>
 *       <flare-table-column>Item 6</flare-table-column>
 *     </flare-table-row>
 *   </flare-table-body>
 * </flare-table>
 * ```
 *
 * @emits Event#selectionchanged
 *
 * Dispatched when the selection of rows changed.
 */
export default class Table extends FlareElement {
  //#region Fields
  public get header(): TableHeader | null {
    return this.querySelector<TableHeader>(`${prefix}table-header`);
  }

  public get body(): TableBody | null {
    return this.querySelector<TableBody>(`${prefix}table-body`);
  }

  public get activeRow(): TableRow | null {
    return this.querySelector<TableRow>(`${prefix}table-body > ${prefix}table-row[active]`);
  }

  public get activeIndex(): number {
    if (!this.body || !this.activeRow) {
      return -1;
    }

    return [...this.body.children].indexOf(this.activeRow);
  }

  public set activeIndex(value: number) {
    this.clearSelection();

    if (this.body) {
      const row = this.body.rows[value];

      if (row) {
        row.active = true;
        row.selected = true;
      }
    }
  }

  public get selectedRows(): NodeListOf<TableRow> {
    return this.querySelectorAll<TableRow>(`${prefix}table-body > ${prefix}table-row[selected]`);
  }
  //#endregion

  public constructor() {
    super({
      template,
    });

    this.addEventListener('select', event => {
      const selectEvent = event as CustomEvent<SelectEventDetail>;
      const targetRow = event.target as TableRow;

      if (selectEvent.detail.toggle) {
        targetRow.selected = !targetRow.selected;
      } else {
        // todo: range selection
        if (this.body) {
          this.body.rows.forEach(row => {
            row.selected = false;
            row.active = false;
          });
        }

        targetRow.selected = true;

        if (!selectEvent.detail.range) {
          targetRow.active = true;
        }
      }

      const selectionChangedEvent = new Event('selectionchanged', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      this.dispatchEvent(selectionChangedEvent);
    });
  }

  //#region Methods
  protected override ready(): void {
    if (this.header) {
      [...this.header.columns].forEach(column => {
        const observer = new ResizeObserver(entries => {
          for (const entry of entries) {
            if (entry.borderBoxSize) {
              this.configureColumnWidths();
            }
          }
        });

        observer.observe(column);
      });
    }

    this.configureColumnWidths();
  }

  /**
   * @internal
   */
  public configureColumnWidths(): void {
    if (this.header && this.body) {
      const header = this.header;

      this.body.style.gridTemplateColumns = [...header.columns].map((column, index) => {
        if (index < header.columns.length - 1) {
          const rect = column.getBoundingClientRect();

          return `${rect.width}px`;
        }

        return 'auto';
      }).join(' ');
    }
  }

  private clearSelection(): void {
    this.querySelectorAll<TableRow>(`${prefix}table-body > ${prefix}table-row[selected]`).forEach(row => row.selected = false);
  }
  //#endregion
}
