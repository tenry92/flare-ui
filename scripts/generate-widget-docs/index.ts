/**
 * This script is used for auto-generating documentation of every available
 * widget from the TypeScript source files.
 *
 * The generated documentation will be put as RST files into
 * `docs/source/widgets/generated`.
 */

import { resolve } from 'path';
import * as fs from 'fs/promises';

import chalk from 'chalk';
import { paramCase } from 'change-case';

import Parser from './parser';
import * as rst from './rst';
import { getDocBlocksByTag } from './tsdoc';
import md2rst from './md-to-rst';

const sourcePath = resolve(__dirname, '../../src/widgets');
const outputPath = resolve(__dirname, '../../docs/source/widgets/generated');

/**
 * Recursively find relevant source files (.ts) in a directory.
 */
async function findSourceFiles(path: string = sourcePath): Promise<string[]> {
  const fileEntries = await fs.readdir(path, { withFileTypes: true });

  let files = [] as string[];

  for (const fileEntry of fileEntries) {
    const filename = resolve(path, fileEntry.name);

    if (fileEntry.isDirectory()) {
      files = [...files, ...await findSourceFiles(filename)];
    } else if (fileEntry.isFile() && /\.ts$/.test(filename)) {
      files.push(filename);
    }
  }

  return files;
}

/**
 * Parse script file for documentation and generate RST file if applicable.
 *
 * @param filename The source file (.ts) to generate the documentation from.
 */
async function renderDocForFile(filename: string): Promise<void> {
  const parser = new Parser(filename);
  await parser.parse();

  if (!parser.className) {
    return;
  }

  const output = [] as string[];

  console.log(chalk.blue(`generating doc for ${parser.className}`));

  // title
  output.push(rst.section(parser.className, '='));

  if (parser.classDoc) {
    // summary
    if (parser.classDoc.summary?.trim()) {
      output.push(md2rst(parser.classDoc.summary.trim()));
    }

    // examples
    const exampleBlocks = getDocBlocksByTag(parser.classDoc, '@example');

    if (exampleBlocks.length > 0) {
      output.push(rst.section('Examples', '-'));

      for (const block of exampleBlocks) {
        output.push(md2rst(block.content));
      }
    }
  }

  // attributes and properties
  if (parser.fields.size > 0) {
    output.push(rst.section('Properties', '-'));

    for (const field of parser.fields.values()) {
      output.push(rst.section(field.name, '^'));

      let htmlName: string | undefined;
      let htmlInitOnly = false;

      if (field.docComment) {
        const attrBlock = getDocBlocksByTag(field.docComment, '@reflectsHtmlAttribute')[0];

        if (attrBlock) {
          htmlName = attrBlock.content.trim();
        } else {
          const initBlock = getDocBlocksByTag(field.docComment, '@initsFromHtmlAttribute')[0];

          if (initBlock) {
            htmlName = initBlock.content.trim();
            htmlInitOnly = true;
          }
        }
      }

      const cols = [] as string[];

      if (htmlName) {
        cols.push(htmlName);
      }

      cols.push(field.name);

      if (field.readonly) {
        cols.push(`\`\`${field.type}\`\` (readonly)`);
      } else {
        cols.push(`\`\`${field.type}\`\``);
      }

      if (htmlName) {
        if (htmlInitOnly) {
          cols.push('Initialization only');
        } else {
          cols.push('Reflected');
        }
      }

      const header = htmlName ? ['HTML', 'JavaScript', 'Type', 'Reflection'] : ['JavaScript', 'Type'];

      output.push(rst.table([
        header, cols,
      ]));

      if (field.docComment && field.docComment.summary) {
        output.push(md2rst(field.docComment.summary));
      }
    }
  }

  if (parser.methods.size > 0) {
    output.push(rst.section('Methods', '-'));

    for (const method of parser.methods.values()) {
      output.push(rst.section(`${method.name}()`, '^'));
      // todo: params, return type

      if (method.docComment && method.docComment.summary) {
        output.push(md2rst(method.docComment.summary));
      }
    }
  }

  // events
  if (parser.classDoc) {
    const eventBlocks = getDocBlocksByTag(parser.classDoc, '@emits');

    if (eventBlocks.length > 0) {
      output.push(rst.section('Events', '-'));

      for (const block of eventBlocks) {
        const content = block.content.trim();

        const match = /^([^\s#]+)#([^\s]+)(?:\s+(.*))?$/g.exec(content);

        if (match) {
          const [, eventType, eventName, description] = match;

          output.push(rst.section(eventName, '^'));

          if (description) {
            output.push(md2rst(description));
          }
        }
      }
    }
  }

  // parts
  if (parser.classDoc) {
    const eventBlocks = getDocBlocksByTag(parser.classDoc, '@htmlPart');

    if (eventBlocks.length > 0) {
      output.push(rst.section('Parts', '-'));

      for (const block of eventBlocks) {
        const content = block.content.trim();

        const match = /^([^\s]+)\s+(.*)$/g.exec(content);

        if (match) {
          const [, partName, description] = match;

          output.push(rst.section(partName, '^'));
          output.push(md2rst(description));
        }
      }
    }
  }

  // css props
  if (parser.classDoc) {
    const eventBlocks = getDocBlocksByTag(parser.classDoc, '@cssProperty');

    if (eventBlocks.length > 0) {
      output.push(rst.section('CSS properties', '-'));

      for (const block of eventBlocks) {
        const content = block.content.trim();

        const match = /^([^\s]+)\s+(.*)$/g.exec(content);

        if (match) {
          const [, propName, description] = match;

          output.push(rst.section('``' + propName + '``', '^'));
          output.push(md2rst(description));
        }
      }
    }
  }

  const generatedContent = output.join('\n\n');

  const outFilename = resolve(outputPath, paramCase(parser.className) + '.rst');

  console.log(chalk.green(`writing ${outFilename}`));

  await fs.writeFile(outFilename, generatedContent);
}

/**
 * Script's entry point.
 */
async function main() {
  const filenames = await findSourceFiles();

  for (const filename of filenames) {
    await renderDocForFile(filename);
  }
}

main();
