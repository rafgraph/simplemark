import React from 'react';
import PropTypes from 'prop-types';
import Simplemark from 'react-simplemark';
import customRenderer from './customRenderer';

const SimplemarkOutput = (props) => {
  const style = {
    ...props.style,
  };

  if (props.layout === 'horizontal') {
    style.width = 'calc(50% - 3px)';
    style.height = '100%';
  } else {
    style.width = '100%';
    style.height = 'calc(50% - 3px)';
  }

  return (
    <Simplemark style={style} className="simplemark" renderer={customRenderer}>
      {props.text}
    </Simplemark>
  );
};

SimplemarkOutput.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
};

export default SimplemarkOutput;
