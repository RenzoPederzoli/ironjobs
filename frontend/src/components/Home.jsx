import React from 'react';
import JobSearch from './jobsearch/jobsearch.js'
import '../Styles/home.css'

const Home = (props) => {
  return ( 
    <div>
        <JobSearch {...props}/>
    </div>
  );
}
 
export default Home;