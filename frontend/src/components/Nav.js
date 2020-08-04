import React from 'react';
import "../Styles/nav.css";
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="nav-wrapper">
      <Link to="/" className="mobile-logo"><img src={require("../images/mobile-logo.png")}></img></Link>
      <Link id='desktop-homepage-signin-button' to='/profile'><img src={require('../images/desktop-home/desktop-homepage-signin-button.svg')} /></Link>
    </div>
  );
};

export default Nav;