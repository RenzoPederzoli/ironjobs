import React, { Fragment, useState } from "react";

const JobSearch = (props) => {
    let [location, setLocation] = useState("");
    let [searchTerm, setSearchTerm] = useState("");

    const changeLocation = e => {
        setLocation(e.target.value)
    }

    const changeSearchTerm = e => {
        setSearchTerm(e.target.value)
    }

    const handleSubmit = e => {
        props.history.push(`/search-results/${location}/${searchTerm}`)
    }
  
    return (
      <Fragment>
        Job Search
        <form onSubmit = {handleSubmit}>
            <input type='text' placeholder='where' name='location' onChange={changeLocation}></input>
            <input type='text' placeholder='what' name='searchTerm' onChange={changeSearchTerm}></input>
            <input type="submit" value="Search"/>
        </form>
      </Fragment>
    );
  };
  
  export default JobSearch;