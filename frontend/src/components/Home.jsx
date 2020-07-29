import React from 'react';
import {NavLink} from 'react-router-dom'
const Home = () => {
  return ( 
    <div>
        Home Component
        <NavLink to="/search">Search</NavLink>
    </div>
  );
}
 
export default Home;