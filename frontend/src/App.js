import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './componenets/Home'


function App() {
  return (
    <div>
      AppJS
      <Switch>
        <Route exact path="/home" render={props => <Home {...props} />} />
      </Switch>
    </div>
  );
}

export default App;
