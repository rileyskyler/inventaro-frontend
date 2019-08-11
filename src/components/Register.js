import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography, Checkbox } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 20),
    marginTop: theme.spacing(35)
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
    username: '',
    email: '',
    password: '',
    termsOfUse: false
  });
  
  const [termsOfUsePrompt, setTermsOfUsePrompt] = useState(false);

  const handleRegisterInput = option => event => {
    setRegisterInput({...registerInput, [option]: event.target.value});
  }

  const toggleTermsOfUse = () => {
    setRegisterInput({...registerInput, termsOfUse: !registerInput.termsOfUse})
  }

  const handleSubmit = event => {
    if(event.key === 'Enter') {
      submit()
    }
  }

  const togglePrompt = () => {
    setTermsOfUsePrompt(!termsOfUsePrompt)
  }

  const submit = () => {
    if(registerInput.termsOfUse) {
      props.registerUser(registerInput)
    }
  }

  const handleClose = () => {
    setTermsOfUsePrompt(false)
  }

  const termsOfUse = () => {
    return (
      <Dialog
      open={termsOfUsePrompt}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Terms of Service</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This application is for demonstration purposes only. It is not offered as a service for any commercial use. Any data is publicly accessible and subject to modification or deletion.
          </DialogContentText>
        </DialogContent>
        <DialogActions align="center">
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
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
            onKeyPress={handleSubmit}
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
        <Box display="flex" flexDirection="column">
          <Checkbox
            value={registerInput.termsOfUse}
            onClick={() => toggleTermsOfUse()}
          />
          <Typography>I agree with the <b onClick={() => togglePrompt()}>Terms of Use</b></Typography>.
        </Box>
        <Box>
          <Button onClick={() => submit()}>Register</Button>
          <Button onClick={() => props.history.push("/")}>Cancel</Button>
        </Box>
      </Paper>
      {termsOfUse()}
    </div>
  )
}

export default withRouter(Register);