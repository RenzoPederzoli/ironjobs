import React, { Fragment, useState } from "react";
import actions from "../../services/actions";
import { NotificationManager } from 'react-notifications';

const SignUp = (props) => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    actions
      .signUp({ email, password })
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
    <Fragment>
      <h2>Sign Up</h2>
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
        <input type="submit" value="Sign Up" />
      </form>
    </Fragment>
  );
};

export default SignUp;
