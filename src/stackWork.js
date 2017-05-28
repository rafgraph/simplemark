export function emptyStack(stack, renderer) {
  while (stack.length > 1) {
    closeNode(stack, renderer);
  }
}

export function closeNode(stack, renderer) {
  const node = stack.pop();
  node.props.children = node.children;
  const element = renderer[node.type](node.props);
  stack[stack.length - 1].children.push(element);
}
