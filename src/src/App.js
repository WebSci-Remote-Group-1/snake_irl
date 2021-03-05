import Create from '@components/Create';
import Index from '@components/TempIndex';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import '@assets/style/master.scss';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route path="/create" component={Create} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
