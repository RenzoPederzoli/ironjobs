import React, { Fragment, useState } from "react";
import actions from "../../services/actions";
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom'
import GoogleLogIn from '../auth/googlelogin'

function LogIn(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    actions
      .logIn({ email, password })
      .then((user) => {
        NotificationManager.success("Logged In Succesfully!")
        console.log(user.data);
        props.setUser({ ...user.data });
        props.history.go(-2) //takes you back to where you were
      })
      .catch((response) => {
        NotificationManager.error("Error message","We couldn't find a match, signup if you dont have an account")
        console.error(response.data)
      });
  };

  return (
    <div className="signup-wrapper">
      <div className='signup-container'>
      <div className='form-content'>
      <p className='signup-text'>Sign In</p>
      <Link className="to-login" to="/signup">Sign up</Link>
      <form className='signup-form' onSubmit={handleSubmit}>
        <input className='text-input'
          name="email"
          type="email"
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className='text-input'
          name="password"
          type="password"
          autoComplete="on"
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className='signin-btn' type="submit" value="Sign In" />
      </form>
      <img className='or-sign-in-with' src={require('../../images/or-sign-in-with.svg')}/>
      <GoogleLogIn {...props} setUser={props.setUser}/>
      </div>
      </div>
    </div>
  );
}

export default LogIn;