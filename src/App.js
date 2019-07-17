import React from 'react';

import Navbar from './NavBar';
import Landing from './Landing';
import Dashboard from './Dashboard';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import {
  Link,
  Route,
  Switch
} from 'react-router-dom';

const styles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

class App extends React.Component {
  
  constructor() {
    super()

    this.state = {
      isLoggedIn: false
    }
    this.loginUser = this.loginUser.bind(this);
  }

  loginUser() {
    this.setState({
      isLoggedIn: true
    })
  }
  
  render() {

    const dashboard = () => {
      return (
        <Dashboard
        />

      )
    }

    const landing = () => {
      return (
        <Landing
          loginUser={this.loginUser}
        />
      )
    }

    return (
      <div>
        <Navbar 
          classes={this.props.classes}
        />
        <Switch>
          <Route path='/' component={landing} exact/>
          <Route path='/dashboard' component={dashboard} exact/>
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(App);