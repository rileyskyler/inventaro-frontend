import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const AddLocation = props => {
  const [locationInput, setLocationInput] = useState({
    title: ''
  });

  const handleLocationInput = option => event => {
    setLocationInput({...locationInput, [option]: event.target.value});
  }

  return (
    <div>
    <h3>Add Location</h3>
    <form noValidate autoComplete="off">
      <TextField
        onChange={handleLocationInput('title')}
        id="title"
        label="title"
        type="text"
        name="Add Location"
        autoComplete="text"
        margin="normal"
        variant="outlined"
        value={locationInput.title}
      />
      <Button onClick={() => props.addLocation(locationInput)}>Login</Button>
    </form>
  </div>
  )
}

export default AddLocation