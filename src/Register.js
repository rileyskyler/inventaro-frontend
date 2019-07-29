import React, { useState } from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const Register = props => {

  const [registerInput, setRegisterInput] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const handleRegisterInput = option => event => {
    setRegisterInput({...registerInput, [option]: event.target.value});
  }

  return (
    <div>
      <Paper>
        <form noValidate autoComplete="off">
          <TextField
            onChange={handleRegisterInput('username')}
            id="outlined-username-input"
            label="Username"
            type="username"
            name="username"
            autoComplete="username"
            margin="normal"
            variant="outlined"
          />
          <TextField
            onChange={handleRegisterInput('email')}
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
          />
          <TextField
            onChange={handleRegisterInput('password')}
            id="outlined-password-input"
            label="Password"
            type="password"
            name="password"
            autoComplete="password"
            margin="normal"
            variant="outlined"
          />
          <Button onClick={() => props.registerUser(registerInput)}>Register</Button>
          <Button onClick={() => props.history.push("/")}>Cancel</Button>
        </form>
      </Paper>
    </div>
  )
}

export default withRouter(Register);