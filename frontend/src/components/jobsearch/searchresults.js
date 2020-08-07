import React, { Fragment, useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import actions from "../../services/actions.js";
import { NotificationManager } from 'react-notifications';
import JobSearchPage from './jobsearchpage'
import FooterMobile from "../FooterMobile.js";
import "../../Styles/search-results.css"
import Select from 'react-dropdown-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SearchResults = (props) => {
  let [jobs, setJobs] = useState([]);
  let [originalJobsArray, setOriginalJobsArray] = useState([]);
  let [moreResultsLoading, setMoreResultsLoading] = useState(false)
  let [loading,setLoading] = useState(true)

  let [filters, setFilters] = useState({
    // filterByDate:false, 
    // filterBySeniorotyLevel:false, 
    sortByDate:false,
    sortBySalary:false})

  const [modalShow, setModalShow] = React.useState(false);
  let [clickedJob, setClickedJob] = useState(null)

  const dateFilterOptions = [
    {label: 'Last 24 hours', value: 1},
    {label: 'Last 3 days', value: 3},
    {label: 'Last 7 days', value: 7},
    {label: 'Last 14 days', value: 14},
    {label: 'Last 21 days', value: 21},
    {label: 'All Results', value: null}]

  let [dateFilter, setDateFilter] = useState(null)
    
  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <button onClick={props.onHide} id='close-modal-btn'></button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-body'>
        <button className='add-job-btn' onClick={() => {addJob(clickedJob)}}></button>
        <span className='modal-job-title'>{clickedJob?.title}</span>
        <br/>
        <span className='modal-job-company'>{clickedJob?.company}</span>
        <br/>
        <span className='modal-job-location'>{clickedJob?.location}</span>
        <p className='modal-job-description'>{clickedJob?.summary || clickedJob?.description}</p>
        <button id='modal-apply-now-btn' onClick={()=> clickedJob?.url ? window.open(clickedJob?.url, '_blank') : window.open(clickedJob?.link, '_blank')}>Apply Now</button>
        </Modal.Body>
        {/* <Modal.Footer>
        </Modal.Footer> */}
      </Modal>
    );
  }

  useEffect(() => {
    function getJobs(aid) {
      actions
        .getIndeedJobs(
          props.match.params.location,
          props.match.params.searchTerm
        )
        .then((response) => {
          aid = response.data
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
          console.log(response)
          let today = new Date()
          response.data.map(job=>formatDate(job,today)) //format linkedin jod-posting dates to match indeed's
          let temp = [...aid]
          console.log(temp)
          temp = temp.concat(response.data)
          console.log(temp)
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


  console.log(props)
  const addJob = (job) => {
    if (!props.user.email) {
      NotificationManager.warning("Please sign in to add a listing!")
    }
    else {
      actions.addJob(job)
        .then((res) => {
          if (res.data.user.addedJobs.length === props.user.addedJobs.length)
            NotificationManager.warning("You've already added that job!")
          else 
            NotificationManager.success("Added Job!")
          props.setUser(res.data.user)
          console.log(res)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  // const sortByCompany = () =>{
  //   let jobsCopy=[...jobs]
  //   jobsCopy.sort(function(a, b){
  //     if(a.company < b.company) { return -1; }
  //     if(a.company > b.company) { return 1; }
  //     return 0;
  // })
  //   setJobs(jobsCopy)
  //   // printJobs()
  // }



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

  const changeFilters = jobProp =>{
    setFilters({...filters, 
    [jobProp] : !filters[jobProp]})
  }

  const printJobs = () => {

    return jobs.filter(j => {
      // if(filters.filterBySeniorotyLevel) {
      //   if(j.senorityLevel !== 'Entry level' || !j.senorityLevel)
      //     return false
      // } 
      if(dateFilter === null)
        return true
      else if( /*filters.filterByDate && */ parseInt(j.postDate.split(' ')[0]) > dateFilter)
        return false
      return true
    })
    .sort((a,b) => {if(filters.sortByDate){
      if(a.postDate[0]==='J'){return -1}
      if(a.postDate[0]==='T'){return -1}
      if(parseInt(a.postDate.split(' ')[0]) < parseInt(b.postDate.split(' ')[0])) { return -1; }
      if(parseInt(a.postDate.split(' ')[0]) > parseInt(b.postDate.split(' ')[0])) { return 1; }
      return 0;
    }})
    .sort((a,b)=>{if(filters.sortBySalary){
      if(a.salary && b.salary){
        if(parseInt(a.salary.split(' ')[0].substr(1).replace(',','')) > parseInt(b.salary.split(' ')[0].substr(1).replace(',',''))) {return -1}
        if(parseInt(a.salary.split(' ')[0].substr(1).replace(',','')) > parseInt(b.salary.split(' ')[0].substr(1).replace(',',''))) {return 1}
        return 0
      } 
      if(a.salary && !b.salary)
        return -1
      if(!a.salary && b.salary)
        return 1    
      return 0

  }
    })
    .map((job,i) => {
      return (
        <div onClick={(e) => {
          if(e.target.type !== 'submit'){
          setClickedJob(job); 
          window.innerWidth < 800 ? setModalShow(true) : setModalShow(false)}}} 
          className="job-card" key={i}>
          
          <ul className='job-list'>
            <li className='job-title'>{job.title} <button className='add-job-btn' onClick={() => {addJob(job)}}></button></li> 
            <li className='job-company'>{job.company}</li> 
            <li className='job-location'>{job.location}</li> 
            <li className='job-description'>{job.summary ? job.summary?.slice(0,50)+'...' : job.description?.slice(0,50)+'...'}</li> 
            <li className='job-postDate-seniorityLevel'>{job.postDate} {job.senorityLevel}</li>
          <li>{job.salary}</li>
          </ul> 
              
        </div>
      )
    })
  }

  return (
    <Fragment>
      <JobSearchPage {...props}/>
      <div id='search-results-container'>
        <div id='back-arrow-container'>
       <Link id='mobile-back-arrow' to='/'><img src={require('../../images/mobile-back-arrow.svg')} /></Link>
      <h4>Showing Results for '{props.match.params.searchTerm}' in {props.match.params.location}</h4>
      </div>
      <div id='filter-button-container'>

      <button onClick={() => {
        if(filters.sortBySalary){
          setFilters({
            ...filters,
            'sortByDate': !filters['sortByDate'],
            'sortBySalary': !filters['sortBySalary']
          })
          // changeFilters('sortByDate')
          // changeFilters('sortBySalary')
          
          // console.log(filters)
        }
        else{
        changeFilters('sortByDate')
        }
        }}>Sort by Date</button>

      <button onClick={() => {
        if(filters.sortByDate){
          setFilters({
            ...filters,
            'sortByDate': !filters['sortByDate'],
            'sortBySalary': !filters['sortBySalary']
          })
        }
        else{
        changeFilters('sortBySalary')
        }
        }}>Sort by Salary</button>

      <Select
      placeholder='Date Posted '
      options={dateFilterOptions}
      onChange={(value)=>setDateFilter(value[0].value)}
      // onClick={() => {changeFilters('filterByDate')
      />

      {/* <button onClick={() => {
        changeFilters('filterBySeniorotyLevel')
        }}>Filter by seniority level</button> */}

        </div>
      <br/>
      {loading ? 
      ( <Fragment>Loading...</Fragment> )
        :
        
      ( <div className="search-results"> 
          <div id='all-jobs'>{printJobs()}</div> 
          {clickedJob !== null ? 
          <div id='display-job'>
            <button className='add-job-btn' onClick={() => {addJob(clickedJob)}}></button>
            <span id='display-job-title'>{clickedJob?.title}</span>
            <br/>
            <span id='display-job-company'>{clickedJob?.company}</span>
            <br />
            <span id='display-job-location'>{clickedJob?.location}</span>
            <br/>
            <br/>
            <span id='display-job-description'>{clickedJob?.summary || clickedJob?.description}</span>
            <br/>
            <br/>
            <button id='display-job-apply-btn' onClick={()=> clickedJob?.url ? window.open(clickedJob?.url, '_blank') : window.open(clickedJob?.link, '_blank')}>Apply Now</button>
        </div> : ''} 
          </div> ) }
      

      {moreResultsLoading ? 
      ( <Fragment>Loading more results...</Fragment> )
        :
      ( null ) }
      <FooterMobile {...props} />
      </div>
      <MyVerticallyCenteredModal
        className='modal'
        show={modalShow}
        onHide={() => setModalShow(false)}

      />
    </Fragment>
  )
};

export default SearchResults;