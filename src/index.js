// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SimplemarkProvider } from 'react-simplemark';
import simplemarkRenderer from 'react-simplemark-renderer-default';

ReactDOM.render(
  <SimplemarkProvider renderer={simplemarkRenderer}>
    <App />
  </SimplemarkProvider>,
  document.getElementById('root'),
);
