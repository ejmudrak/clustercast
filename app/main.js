/* Web app entry point
Source: main.js from https://github.com/pheuter/essential-react/tree/master/src
*/

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

// Routes
import Routes from './components/Routes';

import injectTapEventPlugin from 'react-tap-event-plugin';

// // Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
/// For maximum button and icon support, use onTouchTap over onClick
injectTapEventPlugin();

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

// Render the router
ReactDOM.render((
  <Router history={browserHistory}>
    {Routes}
  </Router>
), document.getElementById(DOM_APP_EL_ID));