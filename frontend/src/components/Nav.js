import React from 'react';
import "../Styles/nav.css"

const Nav = () => {
  return (
    <div className="nav-wrapper">
      <img className="mobile-logo" src={require("../images/mobile-logo.svg")}></img>
    </div>
  );
};

export default Nav;