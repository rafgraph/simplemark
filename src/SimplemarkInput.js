import React from 'react';
import PropTypes from 'prop-types';

const SimplemarkInput = (props) => {
  const style = {
    ...props.style,
    fontFamily: 'helvetica, sans-sarif',
    fontSize: '15px',
    letterSpacing: '0.5px',
    lineHeight: '19px',
    wordWrap: 'break-word',
    outline: 'none',
    resize: 'none',
    boxShadow: 'none',
    MozBoxShawdow: 'none',
    borderRadius: '0',
  };

  if (props.layout === 'horizontal') {
    style.width = 'calc(50% - 3px)';
    style.height = '100%';
  } else {
    style.width = '100%';
    style.height = 'calc(50% - 3px)';
  }

  return (
    <textarea
      style={style}
      value={props.text}
      onChange={(e) => props.updateInput(e.target.value)}
    />
  );
};

SimplemarkInput.propTypes = {
  updateInput: PropTypes.func,
  text: PropTypes.string,
  style: PropTypes.object,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
};

export default SimplemarkInput;
