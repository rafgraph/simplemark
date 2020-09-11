# Simplemark

[Demo website](https://simplemark.rafgraph.dev) (demo code on [`gh-pages` branch](https://github.com/rafgraph/simplemark/tree/gh-pages))

> A *smaller* version of Markdown
>
> ~1KB gzipped
>
> Code styled with Prettier

Why? Because Markdown parsers are large. The [Commonmark JS](https://github.com/jgm/commonmark.js) parser is 36KB gzipped and others are of a similar size, which makes Markdown a bad format for saving, parsing, and presenting lightly formatted text in single page apps.

The idea is to create a format where the parser can be easily incorporated into single page apps so the raw string can be loaded from the backend and rendered into HTML on the frontend by the app. The format can be used for user generated content (posts, comments, etc...), and can be created using a GUI text editor or written directly.

Fast - the parser is single pass and runs in `O(n)` time where `n` is the number of characters in the string.

#### Current State
- Supports Heading, Paragraph, Link, Emphasis, Strong, InlineBreak, and BlockBreak elements
- The only [pre-built renderer](https://github.com/rafgraph/react-simplemark/blob/main/src/simplemarkReactRenderer.js) is for React (part of [`react-simplemark`](https://github.com/rafgraph/react-simplemark))
- Todo
  - Add support for List, Image, BlockQuote, InlineCode, and ThematicBreak elements
  - Create plain HTML renderer
  - Create GUI text editor for generating Simplemark formatted text
  - Add fundamentals of the Simplemark format to the readme (blocks, inlines and nesting)
  - Create definitions for each type of element

## Usage
```shell
$ yarn add simplemark
# OR
$ npm install --save simplemark
```
`simplemark` export's a single function which takes two arguments, the `source` string in Simplemark format and a `renderer` object with render functions for each type of element (Heading, Paragraph, Link, etc...).

```js
import simplemark from 'simplemark';

const source = '# String in Simplemark format';
const renderer = {
  Heading({ level, children, key }) {/*return rendered element*/},
  Paragraph({ children, key }) {/*return rendered element*/},
  ...
};

const treeOfRenderedElements = simplemark(source, renderer);
```

#### Renderer
- The `renderer` is an object with render functions for each type of element (Heading, Paragraph, etc... see list below).
- Each render function receives as it's sole argument an object with keys for:
  - `children` an array the element's children (already rendered).
  - `key` a unique id among its parent's children (as a number).
  - Other properties specific to the element type (e.g. `href` and `title` for links).
  - If creating a renderer in React, each render function can be a React Component and the object it receives are its props.
- Currently the only [pre-built renderer](https://github.com/rafgraph/react-simplemark/blob/main/src/simplemarkReactRenderer.js) is for React (part of [`react-simplemark`](https://github.com/rafgraph/react-simplemark)).
```js
// list of all element types created by Simplemark
// all keys are required
const renderer = {
  Heading({ level/*number from 1 to 6*/, children/*array*/, key/*number*/ }) {/*return rendered element*/},
  Paragraph({ children, key }) {/*return rendered element*/},
  Link({ href/*string*/, title/*string*/, children, key }) {/*return rendered element*/},
  Emph({ children, key }) {/*return rendered element*/},
  Strong({ children, key }) {/*return rendered element*/},
  InlineBreak({ key }) {/*return rendered element*/},
  BlockBreak({ key }) {/*return rendered element*/},
};
```
