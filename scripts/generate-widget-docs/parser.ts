/**
 * Script for parsing docblocks in TypeScript comments.
 *
 * I originally tried making use of @microsoft/tsdoc, which is made for exactly
 * this purpose, but it can only be imported as ESM modules, which I didn't get
 * working with TypeScript.
 */

import * as fs from 'fs/promises';
import chalk from 'chalk';

import { AST, parse } from '@typescript-eslint/typescript-estree';
import { TSESTree } from '@typescript-eslint/types';

import { DocComment, getDocBlocksByTag, parseComment } from './tsdoc';

export interface FieldDoc {
  name: string;
  readonly: boolean;
  type: string;
  docComment?: DocComment;
}

export interface ParamDoc {
  name: string;
  type: string;
}

export interface MethodDoc {
  name: string;
  docComment?: DocComment;
  params: ParamDoc[];
  returnType: string;
}

function isJaeElementDeclaration(node: TSESTree.ExportDeclaration | TSESTree.Expression) {
  if (node.type == 'ClassDeclaration' &&
    node.superClass && node.superClass.type == 'Identifier' &&
    node.superClass.name == 'JaeElement') {
      return true;
  }

  return false;
}

/**
 * Doc parsesr for a single file.
 */
export default class Parser {
  /**
   * The filename that is being parsed.
   */
  #filename: string;

  /**
   * Text contents of the file being parsed.
   */
  #fileContents?: string;

  /**
   * Generated abstract syntax tree from the source code.
   */
  #ast?: AST<any>;

  /**
   * The AST for the default class export.
   */
  #classExport?: TSESTree.ExportDefaultDeclaration;

  /**
   * The raw docblock string for the default class export.
   */
  #classDocBlock?: string;

  /**
   * The name of the default class export.
   */
  public className?: string;

  /**
   * The parsed doc comment for the default class export.
   */
  public classDoc?: DocComment;

  /**
   * Fields (including getters/setters) of the default class export.
   */
  public fields = new Map<string, FieldDoc>();

  /**
   * Regular methods of the default class export.
   */
  public methods = new Map<string, MethodDoc>();

  public constructor(filename: string) {
    this.#filename = filename;
  }

  public async parse() {
    console.log(`parsing ${this.#filename}`);

    this.#fileContents = await fs.readFile(this.#filename, 'utf8');
    this.#ast = parse(this.#fileContents, {
      comment: true,
      loc: true,
    });

    this.extractJaeElementDeclaration();

    if (!this.#classExport) {
      console.log(chalk.gray('  no JaeElementDeclaration found'));

      return undefined;
    }

    this.#classDocBlock = this.findMatchingDocBlock(this.#classExport);

    if (this.#classDocBlock) {
      this.classDoc = parseComment(this.#classDocBlock);
    }

    this.extractMembers();
  };

  protected extractJaeElementDeclaration() {
    const defaultExport = this.#ast!.body.filter(node => node.type == 'ExportDefaultDeclaration')[0];

    if (defaultExport && defaultExport.type == 'ExportDefaultDeclaration' && isJaeElementDeclaration(defaultExport.declaration)) {
      this.#classExport = defaultExport;

      const decl = this.#classExport.declaration;

      if (decl.type == 'ClassDeclaration') {
        this.className = decl.id?.name;
      }
    }
  }

  protected findMatchingDocBlock(statement: TSESTree.ProgramStatement | TSESTree.ClassElement): string | undefined {
    for (const comment of this.#ast!.comments!) {
      if (comment.type != 'Block' || comment.value[0] != '*') {
        continue;
      }

      if (comment.loc.end.line == statement.loc.start.line - 1) {
        return `/*${comment.value}*/`;
      }
    }

    return undefined;
  }

  protected parseTypeAnnotation(annotation?: TSESTree.TSTypeAnnotation) {
    if (!annotation || !this.#fileContents) {
      return 'void';
    }

    return this.#fileContents.split('\n').filter((line, number) => {
      return (number + 1) >= annotation.loc.start.line && (number + 1) <= annotation.loc.end.line;
    }).map((line, number) => {
      let numLines = 1 + (annotation.loc.end.line - annotation.loc.start.line);

      if (number == numLines - 1) {
        // last line, strip on right side
        line = line.substring(0, annotation.loc.end.column);
      }

      if (number == 0) {
        // first line, strip on left side
        line = line.substring(annotation.loc.start.column);
      }

      // strip preceding ':'
      return line.substring(1, annotation.loc.end.column).trim();
    }).join(' ');
  }

  protected extractMembers() {
    const classDecl = this.#classExport!.declaration;

    if (classDecl.type != 'ClassDeclaration') {
      return;
    }

    for (const member of classDecl.body.body) {
      const memberDocBlock = this.findMatchingDocBlock(member);
      const memberDoc = memberDocBlock ? parseComment(memberDocBlock) : undefined;

      if (memberDoc && getDocBlocksByTag(memberDoc, '@internal').length > 0) {
        continue;
      }

      switch (member.type) {
        default:
          console.warn(chalk.yellow(`  unhandled member type "${member.type}"`));
          break;
        case 'PropertyDefinition':
          break;
        case 'MethodDefinition': {
          if (member.key.type != 'Identifier') {
            console.warn(chalk.yellow(`  unhandled member key type "${member.key.type}"`));
            break;
          }

          if (member.accessibility != 'public') {
            break;
          }

          const methodName = member.key.name;

          if (['attributeChangedCallback', 'observedAttributes'].includes(methodName)) {
            break;
          }

          switch (member.kind) {
            case 'get':
            case 'set': {
              if (!this.fields.has(methodName)) {
                this.fields.set(methodName, {
                  name: methodName,
                  readonly: member.kind == 'get',
                  type: this.parseTypeAnnotation(member.value.returnType),
                  docComment: memberDoc,
                });
              } else if (member.kind == 'set') {
                const fieldDoc = this.fields.get(methodName)!;
                fieldDoc.readonly = false;
              }

              break;
            }
            case 'constructor':
              break;
            case 'method': {
              let returnType = 'unknown';

              if (member.type == 'MethodDefinition') {
                returnType = this.parseTypeAnnotation(member.value.returnType);
              }

              this.methods.set(methodName, {
                name: methodName,
                docComment: memberDoc,
                returnType,
                params: member.value.params.map(param => {
                  if (param.type == 'Identifier') {
                    return {
                      name: param.name,
                      type: this.parseTypeAnnotation(param.typeAnnotation)
                    };
                  } else {
                    return {
                      name: '?',
                      type: 'unknown',
                    }
                  }
                }),
              });
            }
          }

          break;
        }
      }
    }
  }
}
