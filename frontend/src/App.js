import React from 'react';
import {Switch, Router, Route} from 'react-router-dom';
import Home from './components/Home'
import Scrape from './components/Scrape'


function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route exact path="/scrape" render={props => <Scrape {...props} />} />
      </Switch>
    </div>
  );
}

export default App;
