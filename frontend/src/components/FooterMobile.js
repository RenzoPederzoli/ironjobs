import React from 'react';
import { Link } from 'react-router-dom'

const FooterMobile = (props) => {

  const determineFooter = () => {
    console.log(props)
  }

  return (
    <div className="footer-wrapper">
      {determineFooter()}
    </div>
  );
};

export default FooterMobile;