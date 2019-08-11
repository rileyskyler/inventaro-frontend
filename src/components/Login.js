import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 10),
    marginTop: theme.spacing(40)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

function Login(props) {
  const classes = useStyles();

  const [loginInput, setLoginInput] = useState({
    email: '',
    password: ''
  });
  
  
  const handleLoginInput = option => event => {
    setLoginInput({...loginInput, [option]: event.target.value});
  }
  
  const handleSubmit = event => {
    if(event.key === 'Enter') {
      props.loginUser(loginInput)
    }
  }

  return (    
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3" align="center">
          Login
        </Typography>
        <Box>
          <TextField
            onChange={handleLoginInput('email')}
            className={classes.textField}
            id="email"
            label="Username"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            value={loginInput.email}
          />
        </Box>
        <Box>
          <TextField
            onChange={handleLoginInput('password')}
            onKeyPress={handleSubmit}
            className={classes.textField}
            id="password"
            label="Password"
            type="password"
            name="password"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            value={loginInput.password}
          />
        </Box>
        <Box align="center">
          <Button onClick={() => props.loginUser(loginInput)}>Login</Button>
          <Button onClick={() => props.history.push('/')}>Cancel</Button>
        </Box>
      </Paper>
    </div>
  )
}

export default withRouter(Login);