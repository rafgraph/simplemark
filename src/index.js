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

// takes source text as a string and a renderer object with keys/functions,
// for each type of block and inline, e.g { Paragraph: f(){}, ...}
export default function simplemark(source, renderer) {
  // stack of open nodes
  // type is node type as string e.g. 'Heading', 'Link', etc,
  // children is an array of children as either strings or closed/rendered nodes,
  // props is an object of additional props to pass into the renderer,
  // endCheck is null or an object with keys for chars that might end the node
  // and functions to handle the end of node check e.g. { '*': f(){} }
  const stack = [{ type: 'base', children: [], props: {}, endCheck: null }];
  let i = 0;
  let textStart = 0;
  let textEnd = 0;

  // stack and index control functions
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
      // if blockType is not provided, don't closeNode or emptyStack,
      // just end text and start new text inside of current inline/block node.
      // blocks can't be nested inside any other node (block or inline)
      // so close all nodes on the stack and empty the stack
      if (blockType === 'inline') closeNode(stack, renderer);
      else if (blockType === 'block') emptyStack(stack, renderer);
    },
  };

  // check beginning of source text and push first node onto the stack
  if (newLineCheck[source[0]] !== undefined)
    newLineCheck[source[0]](controlFunctions);
  if (stack.length === 1)
    stack.push({ type: 'Paragraph', children: [], props: {}, endCheck: null });

  // check if current char ends node at the top of the stack
  const checkEnd = () => {
    const { endCheck } = stack[stack.length - 1];
    if (endCheck !== null && endCheck[source[i]]) {
      textEnd = i;
      // if node was indeed ended, call recursively
      // to see if the next node is ended by the next char
      // have to do it here before going back to while loop where i may increase
      if (endCheck[source[i]]() === true) checkEnd();
    }
  };

  // single pass check of source text to build the tree
  // push onto stack to open a node, and pop off the stack to close/render a node
  while (i < source.length) {
    // if node at top of stack has a endCheck function, then checkEnd
    if (stack[stack.length - 1].endCheck !== null) checkEnd();

    // if the current char is a key in the charCheck object,
    // then call the char's charCheck function
    if (charCheck[source[i]] !== undefined) {
      textEnd = i;
      // let the charCheck function control what happens to the stack
      // charCheck will always leave i at the next char to check
      charCheck[source[i]](controlFunctions);
    } else {
      i++;
    }
  }

  emptyStack(stack, renderer);
  return stack[0].children;
}
