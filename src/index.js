const specialChars = {
  '#': 'heading',
  '*': 'bold',
};

const stack = [
  {
    nodeType: 'base',
    children: [],
  },
];

function emptyStack() {
  while (stack.length > 1) {
    closeNode();
  }
}

function closeNode() {
  const completedNode = stack.pop();
  const element = createElement(completedNode);
  stack[stack.length - 1].children.push(element);
}

function createElement(node) {
  // return React.createElement(node.type, {}, node.children)
  return node;
}

function parse(source) {
  for (let i = 0; i < source.length; i++) {
    if (specialChars[source[i]] !== undefined) {
      if (stack[stack.length - 1].nodeType !== 'base') {
        closeNode();
      }
      stack.push({ nodeType: specialChars[source[i]], children: [], });
    } else {
      const start = i;
      while (specialChars[source[i]] === undefined && i !== source.length) {
        i++;
      }
      stack[stack.length - 1].children.push(source.slice(start, i));
      i--;
    }
  }
  emptyStack();
}

const testSource = '#1st heading *1st bold #2nd heading';
parse(testSource);
const util = require('util');
console.log(util.inspect(stack, false, null));
