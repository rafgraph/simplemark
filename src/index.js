function emptyStack(stack, renderer) {
  while (stack.length > 1) {
    closeNode(stack, renderer);
  }
}

function closeNode(stack, renderer) {
  const node = stack.pop();
  const element = renderNode(node, renderer);
  stack[stack.length - 1].children.push(element);
}

function renderNode(node, renderer) {
  node.props.children = node.children;
  return renderer[node.type](node.props);
}

const block = {
  Heading: true,
  Paragraph: true,
};

const inline = {
  Link: true,
  Strong: true,
  Emaphasis: true,
  Softbreak: true,
};

const newLineCheck = {
  '#'({ next, prev, start }) {
    let count = 1;
    let char = next();
    while (count <= 6 && char === '#') {
      count++;
      char = next();
    }
    if (count > 6 || char !== ' ') {
      prev(count);
      start();
      next(count);
      return false;
    }
    start('Heading', null, { level: count });
    return true;
  },
};

const inlineCheck = {
  '['({ next }) {
    next();
  },
  '*'({ next }) {
    next();
  },
  '\n'({ next, prev, start, endNode }) {
    let count = 1;
    let char = next();
    while (char === '\n') {
      count++;
      char = next();
    }
    const nextNode = [];
    const nextStart = (type, endCheck, props) => {
      nextNode.push({ type, endCheck, props });
    };
    const addBlockBreaks = () => {
      for (let i = 0; i < count - 2; i++) {
        endNode('block');
        start('Softbreak');
      }
    };
    if (
      newLineCheck[char] !== undefined &&
      newLineCheck[char]({ next, prev, start: nextStart }) === true
    ) {
      if (count > 2) {
        addBlockBreaks();
      }
      nextNode.forEach(({ type, endCheck, props }) =>
        start(type, endCheck, props),
      );
    } else {
      if (count === 1) {
        start('Softbreak');
        endNode('inline');
      } else if (count === 2) {
        start('Paragraph');
      } else if (count > 2) {
        addBlockBreaks();
        start('Paragraph');
      }
    }
  },
  '\r'({ next, start }) {
    next();
    start();
  },
  '\\'({ next, start }) {
    next();
    start();
    next();
  },
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
    if (inlineCheck[source[i]] !== undefined) {
      textEnd = i;
      inlineCheck[source[i]](controlFunctions);
    } else {
      i++;
    }
  }

  emptyStack(stack, renderer);
  return stack[0].children;
}
