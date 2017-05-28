export function emptyStack(stack, renderer) {
  while (stack.length > 1) {
    closeNode(stack, renderer);
  }
}

export function closeNode(stack, renderer) {
  const node = stack.pop();
  node.props.children = node.children;
  const parent = stack[stack.length - 1];
  node.props.key = parent.children.length;
  const element = renderer[node.type](node.props);
  parent.children.push(element);
}
