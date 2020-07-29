import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import actions from "../services/actions.js";
import { NotificationManager } from 'react-notifications';

const SearchResults = (props) => {
  const INDEED_KEY = process.env.REACT_APP_INDEED_API_KEY;

  let [jobs, setJobs] = useState([]);

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
  
  // console.log(props);

  useEffect(() => {
    function getJobs2() {
      actions
        .getLinkedinJobs(
          props.match.params.location,
          props.match.params.searchTerm
        )
        .then((response) => {
          setJobs(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getJobs2();
  }, []);

  const addJob = (i) => {
    // console.log(i,jobs[i])
    if (!props.user.email) {
      NotificationManager.warning("Please sign in to add a listing!")
    }
    else {
      actions.addJob(jobs[i])
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const printJobs = () => {
    return jobs.map((job,i) => {
      return (
        <Fragment key={i}>
          {job.title} <button onClick={() => {addJob(i)}}> Add </button> <br/> 
        </Fragment>
      )
    })
  }

  return (
    <Fragment>
      Search Results <br/>
      {printJobs()}
    </Fragment>
  )
};

export default SearchResults;