/**
 * Utility functions for generating RST formatted output.
 */

/**
 * Generate section text.
 *
 * @param text Section header.
 * @param separator Section underline, such as `'='` or `'-'`.
 */
export function section(text: string, separator: string) {
  return `${text}\n${separator.repeat(text.length)}`;
}

/**
 * Generate table.
 *
 * @param rows Each row should be an array of columns, each with a string.
 */
export function table(rows: string[][]) {
  const colWidths = [] as number[];

  for (const row of rows) {
    for (const [index, col] of row.entries()) {
      colWidths[index] = Math.max(colWidths[index] ?? 0, col.length);
    }
  }

  const fence = colWidths.map(len => '='.repeat(len)).join(' ');

  let lines = [fence];

  for (const [rowNumber, row] of rows.entries()) {
    const cols = [];

    for (const [index, col] of row.entries()) {
      cols.push(col.padEnd(colWidths[index]));
    }

    lines.push(cols.join(' '));

    if (rowNumber == 0) {
      // separate header from body
      lines.push(fence);
    }
  }

  lines.push(fence);

  return lines.join('\n');
}
