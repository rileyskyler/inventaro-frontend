import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import AddLocation from './AddLocation';
import AddInventory from './AddInventory';

const main = ({user}) => {
  if(!user.locations) {
    return (
      <div>
        <Link to={`/add-location`}>
          Add Location
        </Link>
        <Link to={`/join-location`}>
          Join Location
        </Link>
      </div>
    )
  }
  else {
    return (
      <Link to={`/checkout`}>
        Checkout
      </Link>
    )
  }
}

const Dashboard = props => {
  return main(props)
}

export default withRouter(Dashboard);