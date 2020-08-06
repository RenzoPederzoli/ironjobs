import React from 'react';
import JobSearch from './jobsearch/jobsearch.js'
import '../Styles/home.css'
import { Link } from 'react-router-dom'
import FooterMobile from './FooterMobile.js';

const popularJobs = [
  "Front-end Engineer",
  "Java Developer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "Data Engineer",
  "Software Engineer",
  "Speech Language Pathologist",
  "Strategy Manager",
  "Business Development Manager"
]

const Home = (props) => {

  const printPopJobs = () => {
    return popularJobs.map((item,i) => {
      return <Link key={i} className="pop-job" to={`/search-results/Miami/${item}`}>{item}</Link>
    })
  }

  const printGreeting = () => {
    let d = new Date()
    let t = d.getHours()
    if (t >= 19 && t <= 4)
      return "Goot Evening"
    else if (t >= 5 && t <= 11) 
      return "Good Morning"
    else
      return "Good Afternoon"
  }

  return ( 
    <div id='home-container'>
      <p className='home-greeting'>{printGreeting()}</p>
      <p className="home-description">Find Your Next Job Using The Centralized Job Search.</p>
      <JobSearch {...props}/>
      <img id='desktop-home-image' src={require('../images/desktop-home/desktop-home-image.png')} />
      <p className="pop-jobs-title"> Popular Jobs </p>
      <div className="pop-jobs-container">
        {printPopJobs()}
      </div>
      <FooterMobile {...props}/>
    </div>
  );
}
 
export default Home;