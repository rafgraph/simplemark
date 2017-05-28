// chars to check only at the start of new lines
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
      return false;
    }
    start('Heading', null, { level: count });
    return true;
  },
};

// chars to always check
export const charCheck = {
  '['({ next, prev, start, endNode }) {
    next();
    const endCheck = {
      ']'() {
        let count = 1;
        let char = next();
        let href = '';
        let title = '';
        if (char === '(') {
          count++;
          char = next();
          while (
            char !== ' ' &&
            char !== ')' &&
            char !== '\n' &&
            char !== undefined
          ) {
            href += char;
            count++;
            char = next();
          }
          if (char === ' ') {
            count++;
            char = next();
            while (char !== ')' && char !== '\n' && char !== undefined) {
              title += char;
              count++;
              char = next();
            }
          }
          if (char === ')') {
            next();
            endNode('inline', {
              href,
              title: title !== '' ? title : undefined,
            });
            return true;
          }
        }
        prev(count);
        return false;
      },
    };
    start('Link', endCheck);
  },

  '*'({ next, prev, start, endNode }) {
    if (next() === '*') {
      next();
      const endCheck = {
        '*'() {
          if (next() === '*') {
            next();
            endNode('inline');
            return true;
          }
          prev();
          return false;
        },
      };
      start('Strong', endCheck);
    } else {
      const endCheck = {
        '*'() {
          next();
          endNode('inline');
          return true;
        },
      };
      start('Emph', endCheck);
    }
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

  '\r'({ next, endNode }) {
    next();
    endNode();
  },

  '\\'({ next, endNode }) {
    next();
    endNode();
    next();
  },
};
