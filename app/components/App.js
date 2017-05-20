import React from 'react';

// implements Google Material UI framework:		
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {fade} from 'material-ui/utils/colorManipulator';

import {
  green700, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
	  fontFamily: 'Montserrat, sans-serif',
	  palette: {
	    primary1Color: '#c32520',
	    primary2Color: 'red',
	    primary3Color: grey400,
	    accent1Color: '#c32520',
	    accent2Color: grey100,
	    accent3Color: grey500,
	    textColor: darkBlack,
	    alternateTextColor: white,
	    canvasColor: white,
	    borderColor: grey300,
	    disabledColor: fade(darkBlack, 0.3),
	    pickerHeaderColor: '#c32520',
	    clockCircleColor: fade(darkBlack, 0.07),
	    shadowColor: fullBlack,
	  },
});

export default ({children}) => {
  return (
    <div id="container">
      	<MuiThemeProvider>
     		{children}
    	</MuiThemeProvider>
    </div>
  );
}