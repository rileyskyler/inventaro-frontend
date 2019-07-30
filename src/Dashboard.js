import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import AddLocation from './AddLocation';

const main = ({user, match}) => {
  if(!user.locations) {
    return (
      <div>
        <Link to={`${match.url}/location/add`}>
          Add Location
        </Link>
        <Link to={`${match.url}/location/join`}>
          Join Location
        </Link>
      </div>
    )
  }
  else {
    return (
      <Link to={`${match.url}/checkout`}>
        Checkout
      </Link>
    )
  }
}

const Dashboard = props => {
  const { primary, secondary} = props.match.params;
  switch (primary) {
    case 'location':
      switch (secondary) {
        case 'add':
          return (
            <AddLocation
              addLocation={props.addLocation}
            />
          )
        case 'join':
          return <div>Join Location</div>
        default:
          return <div>Locations</div>
      }
    case 'checkout':
      switch(secondary) {
        case undefined:
          return <div>Welcome to checkout</div>
      }
    default:
      return main(props);
  }
}

export default withRouter(Dashboard);