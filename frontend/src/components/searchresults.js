import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';

const SearchResults = (props) => {
    const INDEED_KEY = process.env.REACT_APP_INDEED_API_KEY

    // useEffect(() => {
    //   async function getJobs() {
    //     let jobList = await axios({
    //       "method":"GET",
    //       "url":"https://indeed-com.p.rapidapi.com/search/jobs",
    //       "headers":{
    //       "content-type":"application/octet-stream",
    //       "x-rapidapi-host":"indeed-com.p.rapidapi.com",
    //       "x-rapidapi-key":INDEED_KEY,
    //       "useQueryString":true
    //       },"params":{
    //       "sort":"relevance",
    //       "location":props.match.params.location,
    //       "offset":"0",
    //       "query":props.match.params.searchTerm,
    //       "radius":"50",

    //       }
    //       })
    //       .then((response)=>{
    //         console.log(JSON.stringify(response.data.results))
    //       })
    //       .catch((error)=>{
    //         console.log(error)
    //       })
    //   }
    //   getJobs();    
    // }, [])

    console.log(props)
    
    return (
      <Fragment>
        Search Results
      </Fragment>
    );
  };
  
  export default SearchResults;