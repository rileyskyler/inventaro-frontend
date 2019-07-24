import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';


const Login = props => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h3>Login</h3>
      <form noValidate autoComplete="off">
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email or username"
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          label="Password"
          type="password"
          name="password"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
        <Button onClick={() => props.loginUser({email, password})}>Login</Button>
        <Button onClick={() => props.history.push('/')}>Cancel</Button>
      </form>
    </div>
  )
}

export default withRouter(Login);