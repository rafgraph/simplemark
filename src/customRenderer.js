// @flow
import React from 'react';
import Interactive from 'react-interactive';

export default {
  Link(props: { href: string, title?: string, children: any, key: number }) {
    return (
      <Interactive
        as="a"
        href={props.href}
        title={props.title}
        hover={{ textDecoration: 'underline' }}
        active="hover"
        focusFromTab={{
          backgroundColor: 'rgba(3, 102, 214, 0.05)',
          border: '2px solid rgba(3, 102, 214, 0.5)',
          padding: '2px 3px',
          margin: '-4px -5px',
          borderRadius: '3px',
        }}
        touchActiveTapOnly
        key={props.key}
      >
        {props.children}
      </Interactive>
    );
  },
};
