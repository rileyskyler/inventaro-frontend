import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';




const Login = props => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (event) => {
    setPassword(event.target.value);
  }

  
  return (
    <div>
      <h3>Login</h3>
      <form noValidate autoComplete="off">
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          id="outlined-email-input"
          label="Email or username"
          // className={classes.textField}
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          id="outlined-email-input"
          label="Password"
          // className={classes.textField}
          type="password"
          name="password"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
        <Button onClick={() => props.loginUser({email, password})}>Login</Button>
        <Button onClick={() => props.history.push('/')}>Cancel</Button>
        <Button onClick={() => console.log(password)}>Log</Button>
      </form>
    </div>
  )
}

export default withRouter(Login);