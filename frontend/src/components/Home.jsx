import React from 'react';
import {Link} from 'react-router-dom';
import JobSearch from './jobsearch/jobsearch.js'
import '../Styles/home.css'

const Home = (props) => {

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

  const printPopJobs = () => {
    return popularJobs.map(item => {
      return <Link className="pop-job" to={`/search-results/Miami/${item}`}>{item}</Link>
    })
  }

  return ( 
    <div>
        <p className='home-greeting'>Good Morning</p>
        <p className="home-description">Find Your Next Job Using The Centralized Job Search.</p>
        <JobSearch {...props}/>
        <img id='desktop-home-image' src={require('../images/desktop-home/desktop-home-image.png')} />
        <p className="pop-jobs-title"> Popular Jobs </p>
      <div className="pop-jobs-container">
        {printPopJobs()}
      </div>
    </div>
  );
}
 
export default Home;