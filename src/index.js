import { charCheck, newLineCheck } from './charChecks';
import { emptyStack, closeNode } from './stackWork';

const block = {
  Heading: true,
  Paragraph: true,
  BlockBreak: true,
};

// for reference, not needed
// const inline = {
//   Link: true,
//   Strong: true,
//   Emph: true,
//   InlineBreak: true,
// };

export default function simplemark(source, renderer) {
  const stack = [{ type: 'base', children: [], props: {}, endCheck: null }];
  let i = 0;
  let textStart = 0;
  let textEnd = 0; // last text position

  const controlFunctions = {
    next(num = 1) {
      i = i + num;
      return source[i];
    },
    prev(num = 1) {
      i = i - num;
    },
    start(type, endCheck = null, props = {}) {
      controlFunctions.endNode(block[type] !== undefined ? 'block' : null);
      stack.push({ type, props, children: [], endCheck });
    },
    endNode(blockType, props) {
      if (props !== undefined) stack[stack.length - 1].props = props;
      if (textEnd !== textStart)
        stack[stack.length - 1].children.push(source.slice(textStart, textEnd));
      textStart = i;
      textEnd = textStart;
      if (blockType === 'inline') closeNode(stack, renderer);
      else if (blockType === 'block') emptyStack(stack, renderer);
    },
  };

  if (newLineCheck[source[0]] !== undefined)
    newLineCheck[source[0]](controlFunctions);
  if (stack.length === 1)
    stack.push({ type: 'Paragraph', children: [], props: {}, endCheck: null });

  const checkEnd = () => {
    const { endCheck } = stack[stack.length - 1];
    if (endCheck !== null && endCheck[source[i]]) {
      textEnd = i;
      if (endCheck[source[i]]() === true) checkEnd();
    }
  };

  while (i < source.length) {
    if (stack[stack.length - 1].endCheck !== null) checkEnd();
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
