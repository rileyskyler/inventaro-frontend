import React from 'react';
import Navbar from './NavBar';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import { withRouter } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';

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
      isAuth: false
    }
    
    this.loginUser = this.loginUser.bind(this);
  }
  
  componentDidMount() {

  }
  
  loginUser({email, password}) {
    
    this.setState({
      isAuth: true
    })
    this.props.history.push(`/dashboard`);
  }

  registerUser({email, password}) {
    // register user
    this.loginUser()
  }
  
  render() {

    const dashboard = () => {
      return (
        <Dashboard/>
      )
    }

    const landing = () => {
      return (
        <Landing/>
      )
    }

    const login = () => {
      return (
        <Login
          loginUser={this.loginUser}
        />
      )
    }

    const register = () => {
      return (
        <Register
          registerUser={this.registerUser}
        />
      )
    }

    return (
      <div>
        <Navbar 
          classes={this.props.classes}
          isAuth={this.state.isAuth}
        />
        <Switch>
          <Route path='/' component={landing} exact/>
          <Route path='/login' component={login} exact/>
          <Route path='/register' component={register} exact/>
          <Route path='/dashboard' component={dashboard} exact/>
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(App));