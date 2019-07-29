import React from 'react';
import { withRouter } from 'react-router-dom';
import Locations from './Locations';

const Dashboard = props => {
  return (
    (props.user.locations)
    ?
    <div>Home</div>
    :
    <Locations 
      addLocation={props.addLocation}
      // joinLocation={props.joinLocation}
    />

  )
}


export default withRouter(Dashboard);