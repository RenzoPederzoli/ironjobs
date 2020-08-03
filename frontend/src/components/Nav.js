import React from 'react';
import "../Styles/nav.css";
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="nav-wrapper">
      <Link to="/" className="mobile-logo"><img src={require("../images/mobile-logo.png")}></img></Link>
    </div>
  );
};

export default Nav;