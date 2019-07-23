import React from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

class Register extends React.Component {

  render() {
    return (
      <div>
        <Paper>
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
              id="zoutlined-email-input"
              label="Password"
              // className={classes.textField}
              type="password"
              name="password"
              autoComplete="password"
              margin="normal"
              variant="outlined"
            />
            <Button onClick={() => this.props.loginUser()}>Register</Button>
            <Button onClick={() => this.props.history.push("/")}>Cancel</Button>
          </form>
        </Paper>
      </div>
    )
  }
}

export default withRouter(Register);