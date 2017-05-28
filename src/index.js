import { charCheck, newLineCheck } from './charChecks';
import { emptyStack, closeNode } from './stackWork';

const block = {
  Heading: true,
  Paragraph: true,
  BlockBreak: true,
};

const inline = {
  Link: true,
  Strong: true,
  Emaphasis: true,
  InlineBreak: true,
};

export default function simplemark(source, renderer) {
  const stack = [{ type: 'base', children: [], props: {} }];
  let i = 0;
  let textStart = 0;
  let textEnd = 0; // last text position
  let checkEnd = null;

  const controlFunctions = {
    next(num) {
      if (num !== undefined) i = i + num;
      else i++;
      return source[i];
    },
    prev(num) {
      if (num !== undefined) i = i - num;
      else i--;
    },
    start(type, endCheck = null, props = {}) {
      controlFunctions.endNode(block[type] !== undefined ? 'block' : null);
      stack.push({ type, props, children: [] });
    },
    endNode(blockType, props) {
      if (props !== undefined) stack[stack.length - 1].props = props;
      if (textEnd !== textStart)
        stack[stack.length - 1].children.push(source.slice(textStart, textEnd));
      textStart = i;
      textEnd = textStart;
      checkEnd = null;
      if (blockType === 'inline') closeNode(stack, renderer);
      else if (blockType === 'block') emptyStack(stack, renderer);
    },
  };

  if (newLineCheck[source[0]] !== undefined)
    newLineCheck[source[0]](controlFunctions);
  if (stack.length === 1)
    stack.push({ type: 'Paragraph', children: [], props: {} });

  while (i < source.length) {
    if (checkEnd !== null && checkEnd[source[i]]) {
      textEnd = i;
      checkEnd[source[i]](controlFunctions);
    }
    if (charCheck[source[i]] !== undefined) {
      textEnd = i;
      charCheck[source[i]](controlFunctions);
    } else {
      i++;
    }
  }

  emptyStack(stack, renderer);
  return stack[0].children;
}
