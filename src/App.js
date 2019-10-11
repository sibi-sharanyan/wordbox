import React from 'react';
import GenLink from './GenLink';
import Inbox from './Inbox';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">

<Router>
      <div>
 
        <Switch>


          <Route exact path="/" component={GenLink} />

          <Route path="/:userid" component={Inbox} />

        </Switch>
      </div>
    </Router>

 
    </div>
  );
}

export default App;
