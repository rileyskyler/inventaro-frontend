import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';


const Login = props => {

  const [loginInput, setLoginInput] = useState({
    title: ''
  });
  
  const handleLoginInput = option => event => {
    setLoginInput({...loginInput, [option]: event.target.value});
  }
  
  return (
    <div>
      <h3>Login</h3>
      <form noValidate autoComplete="off">
        <TextField
          onChange={handleLoginInput('email')}
          id="email"
          label="Email or username"
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          onChange={handleLoginInput('password')}
          id="password"
          label="Password"
          type="password"
          name="password"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
        <Button onClick={() => props.loginUser(loginInput)}>Login</Button>
        <Button onClick={() => props.history.push('/')}>Cancel</Button>
      </form>
    </div>
  )
}

export default withRouter(Login);