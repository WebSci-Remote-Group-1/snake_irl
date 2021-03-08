import Create from '@components/Create';
import Index from '@components/TempIndex';
import MobileIndex from '@components/MobileIndex';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Media from 'react-media'; // add Media

import '@assets/style/master.scss';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Media query="(max-width: 599px)">
            {matches =>
              matches ? (
                <Switch> {/* Mobile Routing */}
                  <Route exact path="/" component={MobileIndex}/>
                </Switch>
              ) : (
                <Switch> {/* Desktop Routing */}
                  <Route exact path="/" component={Index}/>
                  <Route path="/create" component={Create} />
                </Switch>
              ) 
            }
          </Media>
        </Switch>
      </Router>
    </>
  );
}

export default App;
