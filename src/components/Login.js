import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));
function Login(props) {
  
  const [loginInput, setLoginInput] = useState({
    title: ''
  });
  
  
  const handleLoginInput = option => event => {
    setLoginInput({...loginInput, [option]: event.target.value});
  }
  
  const classes = useStyles();
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