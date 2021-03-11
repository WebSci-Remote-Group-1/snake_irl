import Create from '@components/Create';
import Index from '@components/TempIndex';
import MobileIndex from '@components/MobileIndex';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Media from 'react-media'; // add Media

import { ThemeProvider } from '@material-ui/core/styles';
import snake_irl_theme from '@components/shared/material-theme-overrides';

import '@assets/style/master.scss';
import TempPlay from './components/TempPlay';

function App() {
  return (
    <>
      <ThemeProvider theme={snake_irl_theme}>
        <Router>
          <Switch>
            <Media query="(max-width: 599px)">
              {(matches) =>
                matches ? (
                  <Switch>
                    {' '}
                    {/* Mobile Routing */}
                    <Route exact path="/" component={MobileIndex} />
                    <Route exact path="/play" component={TempPlay} />
                  </Switch>
                ) : (
                  <Switch>
                    {' '}
                    {/* Desktop Routing */}
                    <Route exact path="/" component={Index} />
                    <Route path="/create" component={Create} />
                  </Switch>
                )
              }
            </Media>
          </Switch>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
