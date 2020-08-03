import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios'
import {Link} from 'react-router-dom'
import defaultSuggestions from './defaultsuggestions.json'
import actions from '../../services/actions'

const Profile = (props) => {
  if(!props.user.email){ // tneed to delay render when refreshed
    props.history.push('/log-in') 
  }
  
  // suggestions very shaky, i.e. "full"
  let [suggestions,setSuggestions] = useState([])

  const selectRandTitle = () => {
    if (!props.user.email) // Only added to prevent error
      return    

    let index = Math.floor(Math.random() * props.user.addedJobs?.length)
    let obj = props.user?.addedJobs[index]
    let regexp = /^[A-Z,a-z]/
    console.log(obj.title.split(" ")[0])
    if (regexp.test(obj.title.split(" ")[0])) {
      return obj.title.split(" ")[0]
    }
    else {
      return "industry"
    }
  }
  
  useEffect(() => {
    let str = selectRandTitle()
    async function getSuggestions() { //proxy to prevent cross site hack
      await axios.get(`https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?rel_trg=${str}&topics=jobs&max=10`)
        .then((res) => {
          if (res.data.length !== 0)
            setSuggestions(res.data)
          else
            setSuggestions(defaultSuggestions)
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    getSuggestions()
  }, [])

  // actually go to DB and delete
  const removeJob = (ind,event) => {
    event.target.parentNode.innerHTML = ""
    actions.removeJob(props.user.addedJobs[ind].title)
      .then((res) => {
        console.log(res)
      })
      .catch((err)=> {
        console.error(err)
      })
  }

  //apply some sort of basic filtering to this save jobs
  const printJobs = () => {
    return props.user.addedJobs?.map((job,i) => {
      return <p key={i}>{job.title} <a target="_blank" href={job.link || job.url}>Link</a><button onClick={(e) => removeJob(i,e)}>Remove</button></p>
    })
  }

  const printSuggestions = () => {
    if (!props.user.email) //Only added to prevent message
      return
    let lastInd = props.user.addedJobs?.length - 1
    let place = props.user.addedJobs[lastInd]?.location
    return suggestions.map((item) => {
      return <Link to={`/search-results/${place}/${item.word}`}>{item.word} <br/></Link>
    })
  }

  return (
    <div>
      <h2>Profile {props.user.email}</h2>
      Saved Jobs <br/>
      {props.user.addedJobs ? 
        ( printJobs() )
        :
        ( <Fragment>Start looking for jobs now!</Fragment> )
      }
      <h3>Suggestions</h3>
      {printSuggestions()}
    </div>
  );
};

export default Profile;