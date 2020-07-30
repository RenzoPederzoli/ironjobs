import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import actions from "../services/actions.js";



const SearchResults = (props) => {
    

    useEffect(() => {
      function getJobs1() {
        actions.getIndeedJobs(props.match.params.location, props.match.params.searchTerm)
          .then((response)=>{
            console.log(response)
          })
          .catch((error)=>{
            console.log(error)
          })
      }
      getJobs1();    
    }, [])

    useEffect(() => {
      function getJobs2() {
        actions.getLinkedinJobs(props.match.params.location, props.match.params.searchTerm)
          .then((response)=>{
            console.log(response.data)
          })
          .catch((error)=>{
            console.log(error)
          })
      }
      getJobs2();    
    }, [])
    
    return (
      <Fragment>
        Search Results
      </Fragment>
    );
  };
  
  export default SearchResults;

  
  
  
  
  // export default class SearchResults extends React.Component {

  //   state = {
  //     jobs: []
  //   }
  
  //   componentDidMount() {
  //     actions.socket.emit('get data', { location: this.props.match.params.location, searchTerm: this.props.match.params.searchTerm })
  //     actions.socket.on('recieve data', (data => {
  //       console.log('data recieved')
  //       let jobs = [...this.state.jobs]
  //       jobs.push(data)
  //       this.setState({ jobs })
  //     }))
  //   }
  
  //   showJobs = () => {
  //     return this.state.jobs.map(job => job.title)
  //   }
  
  //   render() {
  //     return (
  //       <Fragment>
  //         Search Results
  //         {this.showJobs()}
  //       </Fragment>
  //     );
  //   }
  
  // }