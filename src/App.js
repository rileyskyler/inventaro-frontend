import React from 'react';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import AddInventory from './components/AddInventory';
import AddLocation from './components/AddLocation';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDNkZjBkZjlkZDc0NzBiZGVhYTk2ZGEiLCJlbWFpbCI6ImEiLCJpYXQiOjE1NjUwMzIxOTQsImV4cCI6MTU2NTI5MTM5NH0.j1JfbdWfoJCnSXlE1Id-8rNpI2gktIFk4b1HGPVK52s',
      currentLocation: null,
      cart: []
    }
    
    this.fetchApi = this.fetchApi.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.chooseLocation = this.chooseLocation.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.updateCart = this.updateCart.bind(this);
  }

  async componentDidMount() {
    if(this.state.token) {
      await this.getUser()
      //for development
      await this.chooseLocation(this.state.user.locations[0])
      this.props.history.push({
        pathname: '/checkout'
      })
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

  async chooseLocation(location) {
    console.log(location)
    const reqBody = {
      query: `
        query {
          location(id: "${location._id}") {
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
      const updatedLocation = res.data.location;
      this.setState({currentLocation: updatedLocation});
    }
  }

  async updateInventory(inventory) {
    this.setState(({ currentLocation }) => {
      return {currentLocation: {...currentLocation, inventory}};
    })
  }

  async updateCart(cart) {
    this.setState({cart});
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

      await this.setState({token});
      await this.getUser();
      this.props.history.push('/dashboard');
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
      return (
        checkAuth(
          <Checkout
            user={this.state.user}
            cart={this.state.cart}
            updateCart={this.updateCart}
            addLocation={this.addLocation}
            currentLocation={this.state.currentLocation}
          />
        )
      )
    }

    const dashboard = () => {
      return (
        checkAuth(
          <Dashboard
            user={this.state.user}
            addLocation={this.addLocation}
            token={this.state.token}
          />
        )
      )
    }

    const addInventory = () => {
      return (
        checkAuth(
          <AddInventory 
            user={this.state.user}
            currentLocation={this.state.currentLocation}
            updateInventory={this.updateInventory}
            fetchApi={this.fetchApi}
            cart={this.state.cart}
            updateCart={this.updateCart}
          />
        )
      )
    }

    const addLocation = () => {
      return checkAuth(
        <AddLocation 
          fetchApi={this.fetchApi}
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