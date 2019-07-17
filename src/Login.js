import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick() {
    this.props.loginUser()
    this.props.history.push("/dashboard");
  }

  render() {
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
            id="zoutlined-email-input"
            label="Password"
            // className={classes.textField}
            type="password"
            name="password"
            autoComplete="email"
            margin="normal"
            variant="outlined"
          />
          <Button onClick={() => this.handleClick()}>Login</Button>
        </form>
      </div>
    )
  }
}

export default withRouter(Login);