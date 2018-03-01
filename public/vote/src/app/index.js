import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Main} from './components/Main';
const App = () => (
    <MuiThemeProvider>
        <Main  />
    </MuiThemeProvider>
);
ReactDOM.render(
    <App />,
    document.getElementById('app')
);