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
  Break: true,
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
      return;
    }
    start('Heading', null, { level: count });
  },
};

const inlineCheck = {
  '['({ next }) {
    next();
  },
  '*'({ next }) {
    next();
  },
  '\n'({ next, start, newLine }) {
    newLine();
    let char = next();
    if (char === '\n') {
      next();
      start('Paragraph');
    } else {
      start('Softbreak');
    }
  },
  '\r'() {
    console.log('ESCAPECHAR-R');
  },
  '\\'({ next, start }) {
    next();
    start();
    next();
  },
};

export default function parse(source, renderer) {
  const stack = [{ type: 'base', children: [], props: {} }];
  let i = 0;
  let textStart = 0;
  let textEnd = 0; // last text position
  let newLine = true;
  let endCheck = null;

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
    start(type, end = null, props = {}) {
      if (textEnd !== textStart)
        stack[stack.length - 1].children.push(source.slice(textStart, textEnd));
      textStart = i;
      endCheck = end;
      if (block[type]) {
        emptyStack(stack, renderer);
        stack.push({ type, props, children: [] });
      } else if (inline[type]) {
        stack.push({ type, props, children: [] });
      }
    },
    end(props) {
      if (props !== undefined) stack[stack.length - 1].props = props;
      textStart = i;
      endCheck = null;
      closeNode(stack, renderer);
    },
    newLine() {
      newLine = true;
    },
  };

  if (newLineCheck[source[0]] !== undefined)
    newLineCheck[source[0]](controlFunctions);
  if (stack.length === 1)
    stack.push({ type: 'Paragraph', children: [], props: {} });

  while (i < source.length) {
    if (endCheck !== null && endCheck[source[i]]) {
      textEnd = i;
      endCheck[source[i]](controlFunctions);
    }
    if (newLine === true && newLineCheck[source[i]] !== undefined) {
      textEnd = i;
      newLine = false;
      newLineCheck[source[i]](controlFunctions);
    } else if (inlineCheck[source[i]] !== undefined) {
      textEnd = i;
      inlineCheck[source[i]](controlFunctions);
    } else {
      i++;
    }
  }

  emptyStack(stack, renderer);
  return stack[0].children;
}
