import React, { Fragment, useState } from "react";
import actions from "../../services/actions";
import { Link } from 'react-router-dom'
import { NotificationManager } from 'react-notifications';
import "../../Styles/signup.css"
import GoogleSignUp from '../auth/googlesingup'

const SignUp = (props) => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    actions
      .signUp({ email, password, firstName, lastName})
      .then((user) => {
        NotificationManager.success("Signed Up Succesfully!")
        console.log(user.data);
        props.setUser({ ...user.data });
        props.history.goBack() // takes you back to where you were
      })
      .catch((response) => {
        NotificationManager.error("Error message","Already Exists")
        console.error(response.data)
      });
  };

  return (
    <div className="signup-wrapper">
      <div className='signup-container'>
        <div className='form-content'>
      <p className='signup-text'>Sign Up</p>
      <Link className="to-login" to="/login">Sign in</Link>
      <form className='signup-form' onSubmit={handleSubmit}>
        <input className='text-input'
          name="firstName"
          type="text"
          placeholder='First Name'
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input className='text-input'
          name="lastName"
          type="text"
          placeholder='Last Name'
          onChange={(e) => setLastName(e.target.value)}
        />
        <input className='text-input'
          name="email"
          type="email"
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className='text-input'
          name="password"
          type="password"
          placeholder='Password'
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className='signup-btn' type="submit" value="Sign Up" />
      </form>
      <img className='or-sign-in-with' src={require('../../images/or-sign-in-with.svg')}/>
      <GoogleSignUp {...props} setUser={props.setUser} />
      </div>
      </div>
    </div>
  );
};

export default SignUp;
