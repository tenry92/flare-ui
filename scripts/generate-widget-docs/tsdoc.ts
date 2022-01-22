export interface DocBlock {
  tag: string;
  content: string;
}

export interface DocComment {
  summary?: string;
  docBlocks: DocBlock[];
}

export function getDocBlocksByTag(docComment: DocComment, tag: string) {
  return docComment.docBlocks.filter(block => block.tag == tag);
}

export function parseComment(comment: string) {
  const rawContent = extractCommentContent(comment);

  const regExp = /@(example|emits|cssProperty|htmlPart|reflectsHtmlAttribute|initsFromHtmlAttribute|cssState|param|return|internal)/g;

  const docComment: DocComment = {
    docBlocks: [],
  };

  let lastOffset = 0;
  let precedingDocBlock: DocBlock | undefined;

  while (true) {
    const match = regExp.exec(rawContent);

    if (!match) {
      break;
    }

    const precedingContent = rawContent.substring(lastOffset, match.index);
    lastOffset = match.index + match[0].length + 1;

    if (docComment.summary == undefined) {
      docComment.summary = precedingContent;
    } else if (precedingDocBlock) {
      precedingDocBlock.content = precedingContent;
    }

    precedingDocBlock = {
      tag: match[0],
      content: '',
    };

    docComment.docBlocks.push(precedingDocBlock);
  }

  const remainingContent = rawContent.substring(lastOffset);

  if (docComment.summary == undefined) {
    docComment.summary = remainingContent;
  } else if (precedingDocBlock) {
    precedingDocBlock.content = remainingContent;
  }

  return docComment;
}

/**
 * Extract raw content from a multiline doc comment.
 */
function extractCommentContent(comment: string) {
  return comment
    .replace(/^\/\*\*+/, '') // remove leading /**
    .replace(/\*+\/$/, '') // remove trailing */
    .trim()
    .split('\n').map(line => line.replace(/^\s*\*(\s|$)/, '')).join('\n') // remove * at start of a line
    .trim()
  ;
}
