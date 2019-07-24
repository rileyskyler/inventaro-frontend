import React, { useState } from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const Register = props => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <Paper>
        <form noValidate autoComplete="off">
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            id="outlined-username-input"
            label="Username"
            type="username"
            name="username"
            autoComplete="username"
            margin="normal"
            variant="outlined"
          />
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            id="outlined-password-input"
            label="Password"
            type="password"
            name="password"
            autoComplete="password"
            margin="normal"
            variant="outlined"
          />
          <Button onClick={() => props.registerUser({username, email, password})}>Register</Button>
          <Button onClick={() => props.history.push("/")}>Cancel</Button>
        </form>
      </Paper>
    </div>
  )
}

export default withRouter(Register);