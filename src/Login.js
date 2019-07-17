import React from 'react';
import { TextField } from '@material-ui/core';

function Login() {
  return (
    <div>
      <h3>Login</h3>
      <form noValidate autoComplete="off">
        <TextField
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
          id="outlined-email-input"
          label="Password"
          // className={classes.textField}
          type="password"
          name="password"
          autoComplete="email"
          margin="normal"
          variant="outlined"
        />
      </form>
    </div>
  )
}

export default Login;