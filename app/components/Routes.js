import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Home from '../pages/home/page';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="home" component={Home} />
    // Add more routes here
  </Route>
);
