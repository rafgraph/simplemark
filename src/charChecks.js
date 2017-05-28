export const newLineCheck = {
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

export const charCheck = {
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
        start('BlockBreak');
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
        start('InlineBreak');
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
