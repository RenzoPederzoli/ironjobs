import React from 'react';
import "../Styles/nav.css";
import { Link } from 'react-router-dom'

const Nav = (props) => {
  return (
    <div className="nav-wrapper">
      <Link to="/" className="mobile-logo"><img src={require("../images/mobile-logo.png")}></img></Link>
      <div className="right-content">
       {props.user?.email ? (
        <span className="signout-btn" onClick={props.logOut}>Sign Out</span>
       ) : null }
       <Link id='desktop-homepage-signin-button' to='/profile'><img src={require('../images/desktop-home/desktop-homepage-signin-button.svg')} /></Link>
      </div>
      
    </div>
  );
};

export default Nav;