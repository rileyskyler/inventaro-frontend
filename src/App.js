import React from 'react';
import Navigation from './Navigation';
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
      user: null,
      isAuth: false,
      token: ''
    }
    
    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.joinLocation = this.joinLocation.bind(this)
  }
  
  async fetchApi(reqBody) {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.state.token}`
    };
    let res;
    try {  
      res = await fetch('http://localhost:1337/api', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers
      })
      if(res.status === 200) {
        return res.json();
      }
    }
    catch (err) {
      throw err
    }
  }

  async getUser() {
    const reqBody = {
      query: `
        query{
          user{ 
            username,
            email,
            locations{
              title,
              salesTax,
              inventory{
                quantity,
                item{ title, price }
              }
            }
          }
        }
      `
    };
    const res = await this.fetchApi(reqBody);
    if(res) {
      const user = res.data.user;
      this.setState({user});
      return;
    }
  }

  async loginUser({email, password}) {
    const reqBody = {
      query: `
        query{
          login(
            loginInput:{ 
              email:"${email}",
              password: "${password}"
            }
          )
          {token}
        }
      `
    };
    const res = await this.fetchApi(reqBody);
    if(res) {
      await this.setState({token: res.data.login.token})
      await this.getUser();
      this.props.history.push('/');
    }
  }

  async registerUser({username, email, password}) {
    const reqBody = {
      query: `
        mutation {
          createUser(
            userInput: {
              username: "${username}",
              email: "${email}",
              password: "${password}"
            }
          )
          {
            _id,
            username,
            email,
            password
          }
        }
      `
    };
    const res = await this.fetchApi(reqBody);
    if(res) {
      this.loginUser({email, password});
    }
  }

  async addLocation({title}) {
    const reqBody = {
      query: `
        mutation {
          createLocation(locationInput: {title: "${title}"}) {
            title
          }
        }
      `
    };
    const res = await this.fetchApi(reqBody);
    if(res) {
      this.getUser();
    }
  }

  async joinLocation() {

  }
  
  render() {
    
    const landing = () => {
      return (
        <Landing/>
      )
    }

    const dashboard = () => {
      return (
        <Dashboard
          user={this.state.user}
          addLocation={this.addLocation}
        />
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
        <Navigation 
          classes={this.props.classes}
          isAuth={this.state.isAuth}
        />
        <Switch>
          <Route exact path='/' component={landing}/>
          <Route exact path='/login' component={login}/>
          <Route exact path='/register' component={register}/>
          <Route exact path='/dashboard' component={dashboard}/>
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(App));