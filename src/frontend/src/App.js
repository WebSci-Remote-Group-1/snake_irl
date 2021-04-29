import Create from '@components/Create';
import Index from '@components/DesktopIndex';
import { Admin } from '@components/Admin';
import MobileIndex from '@components/MobileIndex';
import Profile from '@components/Profile';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Media from 'react-media'; // add Media

import { ThemeProvider } from '@material-ui/core/styles';
import snake_irl_theme from '@components/shared/material-theme-overrides';

import '@assets/style/master.scss';
import Game from './components/Game';

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
                    <Route path="/play" component={Game} />
                    <Route exact path="/profiles/:id" component={Profile} />
                  </Switch>
                ) : (
                  <Switch>
                    {' '}
                    {/* Desktop Routing */}
                    <Route exact path="/" component={Index} />
                    <Route path="/create" component={Create} />
                    <Route path="/admin" component={Admin} />
                    <Route exact path="/profiles/:id" component={Profile} />
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
