import React, { Fragment, useState, useEffect } from "react";
import actions from "../../services/actions.js";
import { NotificationManager } from 'react-notifications';

const SearchResults = (props) => {
  const INDEED_KEY = process.env.REACT_APP_INDEED_API_KEY;

  let [jobs, setJobs] = useState([]);
  let [originalJobsArray, setOriginalJobsArray] = useState([]);
  let [loading,setLoading] = useState(true)

  useEffect(() => {
    function getJobs2() {
      actions
        .getLinkedinJobs(
          props.match.params.location,
          props.match.params.searchTerm
        )
        .then((response) => {
          setJobs(response?.data);
          setOriginalJobsArray(response?.data)
          setLoading(false)
          if (response.data.length === 0) {
            NotificationManager.warning("No Jobs found")
            props.history.push('/search')
          }
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getJobs2();
  }, []);

  const addJob = (i) => {
    if (!props.user.email) {
      NotificationManager.warning("Please sign in to add a listing!")
    }
    else {
      actions.addJob(jobs[i])
        .then((res) => {
          NotificationManager.success("Added Job!")
          console.log(res)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const sortByDate = () =>{
    let jobsCopy=[...jobs]
    jobsCopy.sort((a,b)=>new Date(b.date) - new Date(a.date))
    setJobs(jobsCopy)
    printJobs()
  }

  const filterByDate = () =>{
    let today = new Date()
    let month = today.getMonth().toString()
    if(month.length==1){
      month="0"+month
    }
    let day = today.getDate().toString()
    let year = today.getFullYear().toString()
    let fToday = year+month+day
    let jobsFilteredByDate = []
    jobs.map((job)=>{
      let jobDate = new Date(job.date)
      let jobMonth = jobDate.getMonth().toString()
      if(jobMonth.length==1){
        jobMonth = "0"+jobMonth
      }
      let jobDay = jobDate.getDate().toString()
      let jobYear = jobDate.getFullYear().toString()
      let fJobDate = jobYear+jobMonth+jobDay
      if(Number(fToday) - Number(fJobDate) < 15){
        jobsFilteredByDate.push(job)
      }
    })
    setJobs(jobsFilteredByDate)
    printJobs()
  }

  const filterBySeniorityLevel = () =>{
    let jobsFilteredBySeniorityLevel = []

    jobs.map((job)=>{
      if (job.senorityLevel ==='Entry level'){
        jobsFilteredBySeniorityLevel.push(job)
      }
    })
    setJobs(jobsFilteredBySeniorityLevel)
    printJobs()
  }

  const printJobs = () => {
    return jobs.map((job,i) => {
      return (
        <Fragment key={i}>
          {job.title} {new Date(job.date).toDateString()} {job.senorityLevel}<button onClick={() => {addJob(i)}}> Add </button> <br/> 
        </Fragment>
      )
    })
  }

  return (
    <Fragment>
      Search Results <br/>
      <button onClick={sortByDate}>Sort by date</button>
      <button onClick={filterByDate}>Filter by date xx</button>
      <button onClick={filterBySeniorityLevel}>Filter by seniority level xx</button>
      <br/>
      {loading ? 
      ( <Fragment>Loading...</Fragment> )
        :
      ( printJobs() ) }
    </Fragment>
  )
};

export default SearchResults;