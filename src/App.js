import React from 'react';
import Navigation from './Navigation';
import Landing from './Landing';
import Dashboard from './Dashboard';
import AddInventory from './AddInventory';
import AddLocation from './AddLocation';
import Login from './Login';
import Register from './Register';
import Checkout from './Checkout';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

const styles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  }
}));

class App extends React.Component {
  
  constructor() {
    super()
    
    this.state = {
      user: null,
      isAuth: false,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDNkZjBkZjlkZDc0NzBiZGVhYTk2ZGEiLCJlbWFpbCI6ImEiLCJpYXQiOjE1NjQ2ODY0NzcsImV4cCI6MTU2NDcwNDQ3N30.l8FhCjXVoB2wveQTipMjtwxdPqnkP7bU8qfXzGMXvQY',
      currentLocation: null
    }
    
    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.chooseLocation = this.chooseLocation.bind(this);
  }

  componentDidMount() {
    if(this.state.token) {
      this.getUser()
      //for development
      this.props.history.push('/add-inventory');
    }
  }

  async chooseLocation(location) {
    console.log(location);
    const reqBody = {
      query: `
        query {
          location(id: "5d3e27801d7a1d1115fed2d3") {
            _id
            title
            inventory {
                _id
                quantity
                price
                item {
                    title
                    upc
                }
            }
          }
        }
      `
    };
    const res = await this.fetchApi(reqBody);
    if(res) {
      const location = res.data.location;
      this.setState({currentLocation: location});
      console.log(this.state.currentLocation);
    }
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
        query{ user{ username email locations{ _id title } } }
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
      const token = res.data.login.token;
      console.log(token);
      await this.setState({token});
      await this.getUser();
      this.props.history.push('/dashboard');
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
  
  render() {
    
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

    const checkout = () => {
      return checkAuth(
        <Checkout
          user={this.state.user}
          addLocation={this.addLocation}
        />
      )
    }

    const dashboard = () => {
      return checkAuth(
        <Dashboard
          user={this.state.user}
          addLocation={this.addLocation}
        />
      )
    }

    const addInventory = () => {
      return checkAuth(
        <AddInventory 
          user={this.state.user}
          currentLocation={this.state.currentLocation}
        />
      )
    }

    const addLocation = () => {
      return checkAuth(
        <AddLocation 
          user={this.state.user}
          currentLocation={this.state.currentLocation}
        />
      )
    }

    const checkAuth = (componentToRender) => (
      (this.state.token && this.state.user)
      ? componentToRender
      : <Redirect to='/'/>
    )

    return (
      <div>
        <Navigation 
          token={this.state.token}
          user={this.state.user}
          classes={this.props.classes}
          currentLocation={this.state.currentLocation}
          chooseLocation={this.chooseLocation}
        />
        <Switch>
          <Route exact path='/' render={landing}/>
          <Route exact path='/login' render={login}/>
          <Route exact path='/register' render={register}/>
          <Route path='/dashboard' render={dashboard} />
          <Route path='/add-inventory' render={addInventory}/>
          <Route path='/add-location' render={addLocation}/>
          <Route path='/checkout' render={checkout}/>
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(App));