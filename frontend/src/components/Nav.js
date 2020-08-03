import React from 'react';
import "../Styles/nav.css";
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="nav-wrapper">
      <Link to="/" className="mobile-logo"><img src={require("../images/mobile-logo.png")}></img></Link>
      <img id='desktop-homepage-signin-button' src={require('../images/desktop-home/desktop-homepage-signin-button.svg')} />
    </div>
  );
};

export default Nav;