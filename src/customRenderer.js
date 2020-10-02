import React from 'react';
import PropTypes from 'prop-types';
import Interactive from 'react-interactive';

const Link = (props) => (
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

Link.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  key: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default { Link };
