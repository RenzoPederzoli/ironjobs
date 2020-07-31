import React, { Fragment, useState, useEffect } from "react";
import actions from "../../services/actions.js";
import { NotificationManager } from 'react-notifications';

const SearchResults = (props) => {

  let [jobs, setJobs] = useState([]);
  let [originalJobsArray, setOriginalJobsArray] = useState([]);
  let [moreResultsLoading, setMoreResultsLoading] = useState(false)
  let [loading,setLoading] = useState(true)

  useEffect(() => {
    function getJobs(aid) {
      actions
        .getIndeedJobs(
          props.match.params.location,
          props.match.params.searchTerm
        )
        .then((response) => {
          aid = response.data
          setJobs(response.data);
          setOriginalJobsArray(response.data)
          setLoading(false)
          setMoreResultsLoading(true)
          if (response.data.length === 0) {
            NotificationManager.warning("No Jobs found")
            props.history.push('/search')
          }
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      actions
        .getLinkedinJobs(
          props.match.params.location,
          props.match.params.searchTerm
        )
        .then((response) => {
          let today = formatToday()
          response.data.map(job=>formatDate(job,today)) //format linkedin jod-posting dates to match indeed's
          let temp = [...aid]
          temp = temp.concat(response.data)
          setJobs(temp);
          setOriginalJobsArray(temp)
          setMoreResultsLoading(false)
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getJobs();
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
    jobsCopy.sort((a,b)=>{
      if(a.postDate[0]==='J'){return -1}
      if(a.postDate[0]==='T'){return -1}
      if(parseInt(a.postDate.split(' ')[0]) < parseInt(b.postDate.split(' ')[0])) { return -1; }
      if(parseInt(a.postDate.split(' ')[0]) > parseInt(b.postDate.split(' ')[0])) { return 1; }
      return 0;
    })
    setJobs(jobsCopy)
    printJobs()
  }

  const sortByCompany = () =>{
    let jobsCopy=[...jobs]
    jobsCopy.sort(function(a, b){
      if(a.company < b.company) { return -1; }
      if(a.company > b.company) { return 1; }
      return 0;
  })
    setJobs(jobsCopy)
    printJobs()
  }

  const filterByDate = range =>{
    
    let jobsFilteredByDate = []

    jobs.map((job)=>{
      if(job.postDate[0]=='T' || job.postDate[0]=='J'){
        jobsFilteredByDate.push(job)
      }
      if(job.postDate.split(' ')[0] <= range){
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

  const formatToday = () =>{

    let today = new Date()
    let month = today.getMonth().toString()
    if(month.length==1){
      month="0" + month
    }
    let day = today.getDate().toString()
    let year = today.getFullYear().toString()
    let fToday = year+month+day

    return fToday

  }

  const formatDate = (job, today) =>{

    Object.defineProperty(job, 'postDate',
      Object.getOwnPropertyDescriptor(job, 'date'));
    delete job['date'];

    let jobDate = new Date(job.postDate)
    let jobMonth = jobDate.getMonth().toString()
    if(jobMonth.length==1){
      jobMonth = "0" + jobMonth
      }
    let jobDay = jobDate.getDate().toString()
    let jobYear = jobDate.getFullYear().toString()
    let fJobDate = jobYear+jobMonth+jobDay

    let diff = today-fJobDate

      if(diff === 0){
        job['postDate'] = "Today"
        return job['postDate']
      }

      if(diff>30){
        job['postDate'] = "30+ days ago"
        return job['postDate']
      }

      if(diff === 1){
        job['postDate'] = `${diff} day ago`
        return job['postDate']
      }

      job['postDate'] = `${diff} days ago`
      return job['postDate']

  }

  const printJobs = () => {
    return jobs.map((job,i) => {
      return (
        <Fragment key={i}>
        {job.company} {job.title} {job.postDate} {job.senorityLevel}<button onClick={() => {addJob(i)}}> Add </button> <br/> 
        </Fragment>
      )
    })
  }

  return (
    <Fragment>
      Search Results <br/>
      <button onClick={sortByDate}>Sort by date</button>
      <button onClick={sortByCompany}>Sort by company</button>
      <button onClick={() => filterByDate(14)}>Filter by date xx</button>
      <button onClick={filterBySeniorityLevel}>Filter by seniority level xx</button>
      <br/>
      {loading ? 
      ( <Fragment>Loading...</Fragment> )
        :
      ( printJobs() ) }

      {moreResultsLoading ? 
      ( <Fragment>Loading more results...</Fragment> )
        :
      ( null ) }
    </Fragment>
  )
};

export default SearchResults;