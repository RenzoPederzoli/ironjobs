import React, { Fragment, useState, useEffect } from "react";
import Autocomplete from "react-google-autocomplete";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { NotificationManager } from "react-notifications";
import jobsArr from "./job-phrase-list.json";
import "../../Styles/home.css";

const JobSearch = (props) => {
  let [location, setLocation] = useState("");
  let [searchTerm, setSearchTerm] = useState("");
  // let [searchPlaceholder, setSearchPlaceholder] = useState("")

  // useEffect(() => {
  //   let input = document.querySelector(".sc-htpNat > input").placeholder ="Search"

  // },[])

  const changeLocation = (s) => {
    setLocation(s);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      NotificationManager.warning("Please choose a location");
      return;
    } else if (!searchTerm) {
      NotificationManager.warning("Please choose a job");
      return;
    } else props.history.push(`/search-results/${location}/${searchTerm}`);
  };

  const handleOnSearch = (string, cached) => {
    // onSearch returns the string searched and if
    // the values are cached. If the values are cached
    // "cached" contains the cached values, if not, returns false
    if (!cached) {
      setSearchTerm(string);
    }
    console.log(string, cached);
  };

  const handleOnSelect = (item) => {
    setSearchTerm(item.name);
    console.log(item);
  };

  return (
    <div>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="bars-wrapper">
          <ReactSearchAutocomplete
            items={jobsArr}
            onSearch={handleOnSearch}
            onSelect={handleOnSelect}
            placeholder="Search"
            showIcon={false}
            autoFocus
            // onFocus="Search"
            // onBlur="Search"
          />

          <Autocomplete
            placeholder="Location"
            onPlaceSelected={(place) => {
              changeLocation(place.address_components[0].short_name);
            }}
            autoFocus
            componentRestrictions={{ country: "us" }}
          />
        </div>

        <input className="submit-btn" type="submit" value="" />
      </form>
    </div>
  );
};

export default JobSearch;
