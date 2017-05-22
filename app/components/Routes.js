import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Home from '../pages/home/page';

// HEY! 
// Trying to build and deploy? Make path="clustercast/"
// Trying to develop? Make path="/"
export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
  </Route>
);
