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
      isAuth: false,
      userToken: ''
    }
    
    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }
  
  componentDidMount() {

  }
  
  async apiFetch(reqBody) {

    let res;

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.userToken
    };
    
    try {  
      res = await fetch('http://localhost:1337/api', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers
      })
    }
    catch (err) {
      throw err
    }

    if(res.status === 200) {
      return res.json();
    }
    
  }

  async loginUser({email, password}) {

    const reqBody = {
      query: `
        query { login(loginInput: {email:"${email}", password: "${password}"}){token}}
      `
    };

    const res = await this.apiFetch(reqBody);
    
    if(res) {
      const token = res.data.login.token;
      console.log(token);
      this.setState({token});
      this.props.history.push("/dashboard");
    }

  }

  async registerUser({username, email, password}) {


    const reqBody = {
      query: `
        mutation {createUser(userInput: {username: "${username}", email: "${email}" password: "${password}"}) {_id, username, email, password}}
      `
    };


    const res = await this.apiFetch(reqBody);

    if(res) {
      this.loginUser({email, password});
    }

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