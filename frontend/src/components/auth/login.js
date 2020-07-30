import React, { Fragment, useState } from "react";
import actions from "../../services/actions";
import { NotificationManager } from 'react-notifications';

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
        props.history.goBack() //takes you back to home after login
      })
      .catch((response) => {
        NotificationManager.error("Error message","We couldn't find a match, signup if you dont have an account")
        console.error(response.data)
      });
  };

  return (
    <Fragment>
      <h2>Log In Hooman</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Log In" />
      </form>
    </Fragment>
  );
}

export default LogIn;