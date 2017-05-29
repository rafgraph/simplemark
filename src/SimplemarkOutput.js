// @flow
import React from 'react';
import Simplemark from 'react-simplemark';
import simplemarkRenderer from './simplemarkRenderer';

export default class SimplemarkOutput extends React.PureComponent {
  props: {
    text: string,
    style: {},
    layout: 'horizontal' | 'vertical',
  };
  render() {
    const style = {
      ...this.props.style,
    };

    if (this.props.layout === 'horizontal') {
      style.width = 'calc(50% - 3px)';
      style.height = '100%';
    } else {
      style.width = '100%';
      style.height = 'calc(50% - 3px)';
    }

    return (
      <Simplemark style={style} renderer={simplemarkRenderer}>
        {this.props.text}
      </Simplemark>
    );
  }
}
