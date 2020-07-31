import React, { Fragment, useState } from "react";
import Autocomplete from 'react-google-autocomplete'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import jobsArr from './job-phrase-list.json'

const JobSearch = (props) => {
    let [location, setLocation] = useState("");
    let [searchTerm, setSearchTerm] = useState("");

    const changeLocation = (s) => {
        setLocation(s)
    }
    const handleSubmit = e => {
        props.history.push(`/search-results/${location}/${searchTerm}`)
    }

    const handleOnSearch = (string, cached) => {
      // onSearch returns the string searched and if
      // the values are cached. If the values are cached
      // "cached" contains the cached values, if not, returns false
      if(!cached)
        setSearchTerm(string)
      console.log(string, cached);
    }

    const handleOnSelect = item => {
      setSearchTerm(item.name)
      console.log(item);
    }

    return (
      <Fragment>
        Job Search
        <form onSubmit = {handleSubmit}>
            <ReactSearchAutocomplete
              items={jobsArr}
              onSearch={handleOnSearch}
              onSelect={handleOnSelect}
              placeholder={"What"}
              autoFocus
              styling={{}}
            />

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