import React from 'react';
import FooterMobile from './FooterMobile';
import "../Styles/aboutus.css"

const AboutUs = (props) => {
  return (
    <div>
      <div className="aboutus-wrapper">
        <div>
          <img className="avatar" src={require("../images/avatars/delu avataaars.svg")}></img>
          <span>Delu - Designer </span>
          <div>
            <a target="_blank" href="https://www.linkedin.com/in/delawit/"><i id="link-img" className="fa fa-linkedin-square" aria-hidden="true"></i></a>
            <a target="_blank" href="https://medium.com/@deluu"><i id="link-img" className="fa fa-medium" aria-hidden="true"></i></a>
          </div>         
        </div>
        <div>
          <img className="avatar" src={require("../images/avatars/andrew avataaars.svg")}></img>
          <span>Andrew - Developer </span>
          <div>
            <a target="_blank" href="https://www.linkedin.com/in/hararia/"><i id="link-img" className="fa fa-linkedin-square" aria-hidden="true"></i></a>
            <a target="_blank" href="https://github.com/hararia"><i id="link-img" className="fa fa-github-alt" aria-hidden="true"></i></a>
          </div>
        </div>
        <div>
          <img className="avatar" src={require("../images/avatars/renzo avataars.svg")}></img>
          <span>Renzo - Developer</span>
          <div>
            <a target="_blank" href="https://www.linkedin.com/in/renzop9/"><i id="link-img" className="fa fa-linkedin-square" aria-hidden="true"></i></a>
            <a target="_blank" href="https://github.com/RenzoPederzoli"><i id="link-img" className="fa fa-github-alt" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
      <FooterMobile {...props}/>
    </div>
  );
};

export default AboutUs;