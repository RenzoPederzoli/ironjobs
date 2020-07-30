import React, { Fragment, useState } from "react";
import Autocomplete from 'react-google-autocomplete'

const JobSearch = (props) => {
    let [location, setLocation] = useState("");
    let [searchTerm, setSearchTerm] = useState("");

    const changeLocation = (s) => {
        setLocation(s)
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
            {/* <input type='text' placeholder='where' name='location' onChange={changeLocation}></input> */}
            <input type='text' placeholder='what' name='searchTerm' onChange={changeSearchTerm}></input>
            <Autocomplete
              style={{width: '90%'}}
              onPlaceSelected={(place) => {
                changeLocation(place.address_components[0].short_name)
                // console.log(place);
              }}
              componentRestrictions={{country: "us"}}
            />
            <input type="submit" value="Search"/>
        </form>
      </Fragment>
    );
  };
  
  export default JobSearch;