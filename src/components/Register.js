import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 20),
    marginTop: theme.spacing(50)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

function Register(props) {
  const classes = useStyles();

  const [registerInput, setRegisterInput] = useState({
    username: 'cheese',
    email: 'cheese',
    password: 'cheese'
  });
  
  const handleRegisterInput = option => event => {
    setRegisterInput({...registerInput, [option]: event.target.value});
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3" align="center">
          Register
        </Typography>
        <Box>
          <TextField
            onChange={handleRegisterInput('username')}
            id="outlined-username-input"
            label="Username"
            type="username"
            name="username"
            autoComplete="username"
            margin="normal"
            variant="outlined"
            value={registerInput.username}
          />
        </Box>
        <Box>
          <TextField
            onChange={handleRegisterInput('email')}
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            value={registerInput.email}
          />
        </Box>
        <Box>
          <TextField
            onChange={handleRegisterInput('password')}
            id="outlined-password-input"
            label="Password"
            type="password"
            name="password"
            autoComplete="password"
            margin="normal"
            variant="outlined"
            value={registerInput.password}
          />
        </Box>
        <Box>
          <Button onClick={() => props.registerUser(registerInput)}>Register</Button>
          <Button onClick={() => props.history.push("/")}>Cancel</Button>
        </Box>
      </Paper>
    </div>
  )
}

export default withRouter(Register);