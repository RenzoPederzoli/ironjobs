import React from 'react';
import { Link } from 'react-router-dom'
import "../Styles/mobilefooter.css"

const FooterMobile = (props) => {

  const determineFooter = () => {
    console.log(props.location.pathname)
    switch (props.location.pathname) {
      case ("/") :
        return (<div className="footer-nav-home">
          <Link className="footer-nav-link" to="/"></Link>
          <Link className="footer-nav-link" to="/aboutus"></Link>
          <Link className="footer-nav-link" to="/profile"></Link>
        </div>)
      case ("/profile") :
        return (<div className="footer-nav-profile">
          <Link className="footer-nav-link" to="/"></Link>
          <Link className="footer-nav-link" to="/aboutus"></Link>
          <Link className="footer-nav-link" to="/profile"></Link>
        </div>)
      case ("/aboutus") :
        return (<div className="footer-nav-aboutus">
        <Link className="footer-nav-link" to="/"></Link>
        <Link className="footer-nav-link" to="/aboutus"></Link>
        <Link className="footer-nav-link" to="/profile"></Link>
      </div>)
      default :
       return (<div className="footer-nav-blank">
       <Link className="footer-nav-link" to="/"></Link>
       <Link className="footer-nav-link" to="/aboutus"></Link>
       <Link className="footer-nav-link" to="/profile"></Link>
     </div>)
    }
  }

  return (
    <div className="footer-wrapper">
      {determineFooter()}
    </div>
  );
};

export default FooterMobile;