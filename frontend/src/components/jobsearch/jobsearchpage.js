import React, { Fragment, useState } from "react";
import Autocomplete from 'react-google-autocomplete'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { NotificationManager } from 'react-notifications';
import jobsArr from './job-phrase-list.json';

const JobSearch = (props) => {
    let [location, setLocation] = useState("");
    let [searchTerm, setSearchTerm] = useState("");
    let [searchPlaceholder, setSearchPlaceholder] = useState("")

    const changeLocation = (s) => {
        setLocation(s)
    }
    const handleSubmit = (e) => {
      e.preventDefault()
      if (!location) {
        NotificationManager.warning("Please choose a location")
        return
      }
      else if (!searchTerm) {
        NotificationManager.warning("Please choose a job")
        return
      }
      else
       props.history.push(`/search-results/${location}/${searchTerm}`)
       window.location.reload()
    }

    const handleOnSearch = (string, cached) => {
      // onSearch returns the string searched and if
      // the values are cached. If the values are cached
      // "cached" contains the cached values, if not, returns false
      if (!cached) {
        setSearchTerm(string)
      }
      console.log(string, cached);
    }

    const handleOnSelect = item => {
      setSearchTerm(item.name)
      console.log(item);
    }

    return (
      <Fragment>
        <div>
      <div id='jobsearch-container'>
        <form className='search-results-form' onSubmit = {handleSubmit}>
          <label>Searcg</label>
            <ReactSearchAutocomplete
              id='search-results-job-input'
              items={jobsArr}
              onSearch={handleOnSearch}
              onSelect={handleOnSelect}
              // placeholder={"Search"}
              autoFocus
              showIcon={false}
            />
            <label>Location</label>
            <Autocomplete
              id='search-results-location-input'
              placeholder={"Location"}
              autoComplete='new-password'
              onPlaceSelected={(place) => {
                changeLocation(place.address_components[0].short_name)
              }}
              componentRestrictions={{country: "us"}}
            />
            <input className="search-results-submit-btn" type="submit" value="Find Jobs"/>
        </form>
        </div>
        </div>
      </Fragment>
    );
  };
  
  export default JobSearch;