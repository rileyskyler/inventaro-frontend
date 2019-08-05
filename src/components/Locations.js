import React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import AddLocation from './AddLocation';

function Location(props) {

  const add = () => {
    return (
      <div>
        add it!
      </div>
    )
  }

  const join = () => {
    return (
      <div>
        join it!
      </div>
    )
  }

  switch (props.match.params.secondary) {
    case 'add':
      return (
        <AddLocation
          addLocation={props.addLocation}
        />
      );
    case 'join':
      return join()
    default:
      return (
        <div>
          <Button onClick={() => props.history.push('/location/add')}>Add Location</Button>
          <Button onClick={() => props.history.push('/location/join')}>Join Location</Button>
        </div>
      );
  }

}

export default withRouter(Location);