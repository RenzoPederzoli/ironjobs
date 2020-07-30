import React, {Fragment,NavLink} from 'react';

const Profile = (props) => {
  if(!props.user.email){ 
    props.history.push('/log-in') 
  }

  const printJobs = () => {
    return props.user?.addedJobs.map((job) => {
      return <Fragment>{job.title} <a target="_blank" href={job.link}>Link</a><br/></Fragment>
    })
  }

  return (
    <div>
      <h2>Profile {props.user.email}</h2>
      Saved Jobs <br/>
      {props.user.addedJobs.length !==0 ? 
        ( printJobs() )
        :
        ( <Fragment>Start looking for jobs now!</Fragment> )
      }
    </div>
  );
};

export default Profile;