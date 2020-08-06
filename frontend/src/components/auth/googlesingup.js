import React from "react";
import actions from "../../services/actions";
import { GoogleLogin } from "react-google-login";
import {NotificationManager} from 'react-notifications'

const responseGoogle = (props) => {
  const onResponse = (response) => {
    console.log(response);
    const user = {
      ...response.profileObj,
      password: response.profileObj?.googleId,
    };
    actions
      .signUp(user)
      .then((user) => {
        props.setUser({ ...user.data });
        NotificationManager.success("Successfully signed up!")
        props.history.goBack()
      })
      .catch(({ response }) => console.error(response.data));
  };
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLEID}
      buttonText="Signup"
      onSuccess={onResponse}
      onFailure={onResponse}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default responseGoogle;