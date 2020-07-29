import React, {Fragment, useState, useEffect} from 'react';
import {NavLink, Switch, Route} from 'react-router-dom';
import actions from "./services/actions"
import Home from './components/Home'
import JobSearch from './components/jobsearch'
import SearchResults from './components/searchresults'
import LogIn from './components/auth/login'
import SignUp from './components/auth/signup';
import {NotificationContainer,NotificationManager} from 'react-notifications'

function App() {
  let [user, setUser] = useState({})

  useEffect(() => {
    async function getUser() {
      let user = await actions.isLoggedIn();
      setUser(user.data)
    }
    getUser();    
  }, [])

  const logOut = async () => {
    NotificationManager.info('Logged Out Succesfully')
    let res = await actions.logOut();
    console.log(res)
    setUser({}); //FIX
  };

  return (
    <div>
      IronJobs
      <nav>
      <NavLink to="/"> Home </NavLink>
        {user?.email ? (
          <Fragment>
            <NavLink onClick={logOut} to="/"> Log Out </NavLink>
            <p>Hello, {user.email}</p>
          </Fragment>
        ) : (
          <Fragment>
            <NavLink to="/signup"> Sign Up </NavLink>
            <NavLink to="/login"> Log In </NavLink>
          </Fragment>
        )}
      </nav>

      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route exact path="/login" render={(props) => <LogIn setUser={setUser} {...props} />} />
        <Route exact path="/signup" render={(props) => <SignUp setUser={setUser} {...props} />} />
        <Route exact path="/search" render={(props) => <JobSearch setUser={setUser} {...props} />} />
        <Route exact path="/search-results/:location/:searchTerm" render={(props) => <SearchResults setUser={setUser} {...props} />} />
      </Switch>

      <NotificationContainer/>
    </div>
  );
}

export default App;
