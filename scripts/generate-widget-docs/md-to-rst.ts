/**
 * Add indentation (leading spaces) to each line.
 *
 * @param string Input string, possibly multiline.
 * @param amount Amount of spaces to prepend to each line.
 * @returns Indented string.
 */
function indent(string: string, amount: number) {
  return string.split('\n').map(line => `${' '.repeat(amount)}${line}`).join('\n');
}

/**
 * Convert markdown formatted test into RST formatted text.
 */
export default function markdownToRst(markdown: string): string {
  const output = [];
  const input = markdown.split('\n');
  let match: RegExpExecArray | null;

  while (input.length > 0) {
    let line = input.shift()!;

    if (match = /^```([a-z]*)$/.exec(line)) {
      // start of fenced code
      const lang = match ? match[1] : '';

      const codeLines = [];

      while (input.length > 0) {
        line = input.shift()!;

        if (!/^```$/.test(line)) {
          codeLines.push(line);
        } else {
          const code = codeLines.join('\n').trimEnd();
          output.push(`.. code-block:: ${lang}\n\n${indent(code, 2)}`);
          break; // end of code block
        }
      }
    } else if (match = /^!\[(.*?)]\((.*?)(?:\s+"(.*?)")?\)/g.exec(line)) {
      const [, altText, url, title] = match;

      const props = [] as string[][];

      if (altText != '') {
        props.push(['alt', altText]);
      }

      output.push(`.. image:: ${url}${props.map(([key, value]) => `\n  :${key}: ${value}`)}`);
    } else {
      if (line.trim() != '') {
        output.push(
          line.trim()
            .replace(/_([^_]+)_/, '*$1*') // italic
            .replace(/`([^`]+)`/, '``$1``') // monospace
        );
      }
    }
  }

  return output.join('\n\n');
}
