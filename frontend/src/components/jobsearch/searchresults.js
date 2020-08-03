import React, { Fragment, useState, useEffect } from "react";
import actions from "../../services/actions.js";
import { NotificationManager } from 'react-notifications';

const SearchResults = (props) => {

  let [jobs, setJobs] = useState([]);
  let [originalJobsArray, setOriginalJobsArray] = useState([]);
  let [moreResultsLoading, setMoreResultsLoading] = useState(false)
  let [loading,setLoading] = useState(true)
  let [filteredByDate, setFilteredByDate] = useState(false)
  let [filteredBySeniorityLevel, setFilteredBySeniorityLevel] = useState(false)

  useEffect(() => {
    function getJobs(aid) {
      actions
        .getIndeedJobs(
          props.match.params.location,
          props.match.params.searchTerm
        )
        .then((response) => {
          aid = response.data
          // setJobsObj({...jobsObj, jobsArray:response.data});
          setJobs(response.data)
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
          let today = new Date()
          response.data.map(job=>formatDate(job,today)) //format linkedin jod-posting dates to match indeed's
          let temp = [...aid]
          temp = temp.concat(response.data)
          // setJobsObj({...jobsObj, jobsArray:temp});
          setJobs(temp)
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
    // printJobs()
  }

  const sortByCompany = () =>{
    let jobsCopy=[...jobs]
    jobsCopy.sort(function(a, b){
      if(a.company < b.company) { return -1; }
      if(a.company > b.company) { return 1; }
      return 0;
  })
    setJobs(jobsCopy)
    // printJobs()
  }

  const filterByDate = () =>{
    // if(filteredByDate){
    let jobsFilteredByDate = []

    jobs.map((job)=>{
      if(job.postDate[0]=='T' || job.postDate[0]=='J'){
        jobsFilteredByDate.push(job)
      }
      if(job.postDate.split(' ')[0] <= 14){
        jobsFilteredByDate.push(job)
      }
    })
    setJobs(jobsFilteredByDate)
    // printJobs()
    }
    // else{
    //   setJobs(originalJobsArray)
    //   // printJobs()
    // }
  // }

  const filterBySeniorityLevel = () =>{
    if(!filteredBySeniorityLevel){
    let jobsFilteredBySeniorityLevel = []

    jobs.map((job)=>{
      if (job.senorityLevel ==='Entry level'){
        jobsFilteredBySeniorityLevel.push(job)
      }
    })
    setJobs(jobsFilteredBySeniorityLevel)
    setFilteredBySeniorityLevel(true)
    // printJobs()
    } 
    else{
      setJobs(originalJobsArray)
      setFilteredBySeniorityLevel(false)
    }
  }

  const formatDate = (job, today) =>{

    Object.defineProperty(job, 'postDate',
      Object.getOwnPropertyDescriptor(job, 'date'));
    delete job['date'];

    let jobDate = new Date(job.postDate)
    
    let diffTime = Math.abs(today - jobDate)
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
      if(diffDays === 0){
        job['postDate'] = "Today"
        return job['postDate']
      }

      if(diffDays>30){
        job['postDate'] = "30+ days ago"
        return job['postDate']
      }

      if(diffDays === 1){
        job['postDate'] = `${diffDays} day ago`
        return job['postDate']
      }

      job['postDate'] = `${diffDays} days ago`
      return job['postDate']

  }

  const checkFilters = () =>{
    if(filteredByDate){
      filterByDate()
    }
  }

  const changeFilteredByDate = () =>{
    setFilteredByDate(!filteredByDate)
    console.log(filteredByDate)
    filterByDate()
  }

  const printJobs = () => {
    
    // checkFilters()

    return jobs.map((job,i) => {
      return (
        <Fragment key={i}>
        {job.company} {job.title} {job.postDate} {job.senorityLevel} 
        <button onClick={() => {addJob(i)}}> Add </button>
        <br/> 
        </Fragment>
      )
    })
  }

  return (
    <Fragment>
      {checkFilters}
      Search Results <br/>
      <button onClick={sortByDate}>Sort by date</button>
      {/* <button onClick={sortByCompany}>Sort by company</button> */}
      <button onClick={changeFilteredByDate}>Filter by date xx</button>
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