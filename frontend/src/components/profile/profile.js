import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios'
import {Link} from 'react-router-dom'
import defaultSuggestions from './defaultsuggestions.json'
import actions from '../../services/actions'
import FooterMobile from "../FooterMobile";
import "../../Styles/profile.css";
import { NotificationManager } from 'react-notifications';

const Profile = (props) => {
  if(!props.user.email && !props.user.loading){ 
    props.history.push('/signup')
  }
  
  // console.log(props.user)

  // suggestions very shaky, i.e. "full"
  const [suggestions,setSuggestions] = useState(defaultSuggestions)

  const selectRandTitle = () => {
    if(props.user.addedJobs.length !== 0) {
      let index = Math.floor(Math.random() * props.user.addedJobs?.length)
      let obj = props.user?.addedJobs[index]
      let regexp = /^[A-Z,a-z]/
      // console.log(obj.title.split(" ")[0])
      if (regexp.test(obj.title.split(" ")[0])) {
        return obj.title.split(" ")[0]
      }
      else {
        return "industry"
      }
    }
    else
      return ""
  }
  
  useEffect(() => {
    if(!props.user.email) return
    let str = selectRandTitle()
    async function getSuggestions() { //proxy to prevent cross site hack
      await axios.get(`https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?rel_trg=${str}&topics=jobs&max=15`)
      .then((res) => {
        console.log(res)
          if (res.data.length !== 0)
            setSuggestions(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    getSuggestions()
  }, [props.user])

  // actually go to DB and delete
  const removeJob = (ind,event) => {
    actions.removeJob(props.user.addedJobs[ind].title)
      .then((res) => {
        props.setUser(res.data.user)
        NotificationManager.info('Removed Job')
        console.log(res)
      })
      .catch((err)=> {
        console.error(err)
      })
  }

  //apply some sort of basic filtering to this save jobs
  const printJobs = () => {
    return props.user.addedJobs?.map((job,i) => {
      return (
      <div className="saved-job-wrapper" key={i}>
        <div className="saved-job-card">
          <span className="card-info">
            <p className="job-title">{job.title}</p>
            <p> {job.company}</p>
            <p> {job.location}</p>
            <p className="saved-description"> {job.summary || job.description}</p>
          </span> 
          <span className="remove-bookmark" onClick={(e) => removeJob(i,e)}><img src={require("../../images/profile-imgs/full-bookmark.svg")}></img></span>
        </div>
        <a target="_blank" href={job.link || job.url}><img src={require("../../images/profile-imgs/applynow.png")}></img></a>
      </div> 
      )
    })
  }

  const printSuggestions = () => {
    // console.log(suggestions)
    let lastInd = props.user.addedJobs?.length - 1
    // let place = props.user.addedJobs[lastInd]?.location
    return suggestions.map((item,i) => {
      return <Link key={i} className="suggested-search" to={`/search-results/Miami/${item.word}`}>{item.word} <br/></Link>
    })
  }

  const printHandle = (str) => {
    let s = ""
    for(let char of str) {
      if (char === "@")
        return s
      s += char
    }
  }

  if (!props.user.email) // put a spinner loader here!
    return  <>Loading...</>

  return (
    <div className="profile-wrapper">
      <h2 className="profile-greeting">Hi, {props.user.firstName || printHandle(props.user.email)}!</h2>
      <div className="profile-mini-nav">
        <a href="#saved-jobs"> Saved Jobs </a> | <a href="#suggested">Suggested </a>
      </div>
      <div className="body-container">
        <div id="saved-jobs">
          <h2 className="saved-title"></h2>
          {props.user.addedJobs.length ? 
            ( printJobs() )
            :
            ( <div className="start-looking">Your saved jobs will appear here, start searching now!</div> )
          }
        </div>
        <div id="suggested">
          <h3 className="suggestions-title">Suggestions</h3>
          <div className="suggestions-list">
            {printSuggestions()}
            <img className="nice-pic" src={require("../../images/profile-imgs/nice-pic.svg")}></img>
          </div>
        </div>
      </div>
      
      <FooterMobile {...props}/>
    </div>
  );
};

export default Profile;