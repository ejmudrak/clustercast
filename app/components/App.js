import React from 'react';

// implements Google Material UI framework:		
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default ({children}) => {
  return (
    <div id="container">
      	<MuiThemeProvider>
     		{children}
    	</MuiThemeProvider>
    </div>
  );
}