import React from 'react';
import "../Styles/nav.css"

const Nav = () => {
  return (
    <div className="nav-wrapper">
      <img className="mobile-logo" src={require("../images/mobile-logo.svg")}></img>
      <img id='desktop-homepage-signin-button' src={require('../images/desktop-home/desktop-homepage-signin-button.svg')} />
    </div>
  );
};

export default Nav;