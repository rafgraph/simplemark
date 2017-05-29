// @flow
import React from 'react';
import Interactive from 'react-interactive';

const sharedStyle = {
  fontFamily: 'system-ui, Helvetica, sans-serif',
  lineHeight: '1.5',
  wordWrap: 'break-word',
  color: 'black',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const Heading = (props: {
  level: number,
  style?: {},
  children: any,
  key: number,
}) => {
  const { level, key } = props;
  const style = {
    ...Heading.style,
    fontSize: (level === 1 && '32px') ||
      (level === 2 && '24px') ||
      (level === 3 && '20px') ||
      (level === 4 && '16px') ||
      '14px',
    color: (level === 6 && 'rgb(100, 100, 100)') || 'black',
    paddingBottom: (level <= 2 && '0.3em') || null,
    borderBottom: (level <= 2 && '1px solid rgb(216, 216, 216)') || null,
    ...props.style,
  };
  const H = `h${level}`;
  return <H style={style} key={key}>{props.children}</H>;
};
Heading.style = {
  ...sharedStyle,
  fontWeight: '500',
  margin: '24px 0 16px 0',
  lineHeight: '1.25',
};

const Paragraph = (props: { style?: {}, children: any, key: number }) => {
  const style = props.style
    ? { ...Paragraph.style, ...props.style }
    : Paragraph.style;
  return <p style={style} key={props.key}>{props.children}</p>;
};
Paragraph.style = {
  ...sharedStyle,
  margin: '0 0 16px 0',
};

const Link = (props: {
  href: string,
  title?: string,
  children: any,
  key: number,
}) => {
  return (
    <Interactive
      as="a"
      href={props.href}
      title={props.title}
      {...Link.style}
      key={props.key}
    >
      {props.children}
    </Interactive>
  );
};
Link.style = {
  style: {
    ...sharedStyle,
    color: 'rgb(3, 102, 214)',
    backgroundColor: 'transparent',
    textDecoration: 'none',
  },
  hover: { textDecoration: 'underline' },
  active: 'hover',
  focusFromTab: {
    backgroundColor: 'rgba(3, 102, 214, 0.05)',
    border: '2px solid rgba(3, 102, 214, 0.5)',
    padding: '2px 3px',
    margin: '-4px -5px',
    borderRadius: '3px',
  },
  touchActiveTapOnly: true,
};

const Emph = (props: { children: any, key: number }) => {
  return <em style={Emph.style} key={props.key}>{props.children}</em>;
};
Emph.style = {
  fontStyle: 'italic',
};

const Strong = (props: { children: any, key: number }) => {
  return <strong style={Strong.style} key={props.key}>{props.children}</strong>;
};
Strong.style = {
  fontWeight: '600',
};

export default {
  Heading,
  Paragraph,
  Link,
  Emph,
  Strong,
};
