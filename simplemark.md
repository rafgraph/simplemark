# Simplemark

May 2017

A simpler version of markdown because size matters (commonmark is 36kb gzipped).

Only have (-B = block, -I = inline):
- headings -B
- paragraphs -B
- soft breaks -I or -B (if want to wrap in div instead of render < br/>)
- bold, italic, italic-bold -I
- links (inline notation only) -I
- images(?)
- lists -B
- plain text -I
- block quotes(?) -B


Parse the text input one char at a time, when encounter start of element push it onto the stack, when encounter closing pop it off the stack and create ReactElement.

Separate element types into block and inline, if inline starts and then encounter start of block, auto close the inline element and pop it off the stack. OR, instead of auto close, pop the element off the stack and disregard (add text to previous element on stack).

Created ReactElements and plane text are passed in as an array of children to parent ReactElement.

Since elements are rendered as they are parsed (so only have to go trough once), can pass in custom renderers to parser and it will call those functions when rendering elements. -> Probably separate renders so always have to pass in renders, and have a default set of renders that can pass in. Theoretically could pass in non-react renders.

Can escape special characters with \

This should allow for implementing this with only peeking one char ahead as needed while linearly going though the input string one char at a time.

Hopefully React should take care of unicode and other characters and render them correctly, so don't need to track/map.

Can build gui text editor that saves raw data in simplemark format (just a string).

Maybe allow saving as parsed nested js objects for faster re-rendering of parsed and saved data (it doesn't make sense to always convert to nested js objects and then to ReactElements because slower).


## Stack
Stack of objects:
```js
{
  type: 'link' / 'paragraph' / etc,
  children: [array of children that gets added to]
}
```
