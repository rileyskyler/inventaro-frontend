import React from 'react';
import Navigation from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory'
import AddInventory from './components/AddInventory';
import AddLocation from './components/AddLocation';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';
import Locations from './components/Locations';
import NavBottom from './components/NavBottom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@material-ui/core';

const styles = makeStyles(theme => ({
  root: {
    height: '100vh',
    width: '100vw'
  }
}));

class App extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      user: null,
      isAuth: false,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDNkZjBkZjlkZDc0NzBiZGVhYTk2ZGEiLCJlbWFpbCI6ImEiLCJpYXQiOjE1NjUyOTE1NjcsImV4cCI6MTU2NTU1MDc2N30.Joj3cg6Mnt27HnClr7KtLUA6OjVSKRh9UMASbnWmrcY',
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
      await this.getUser();
      //for development
      await this.chooseLocation(this.state.user.locations[0]);
      this.props.history.push({
        pathname: '/checkout'
      });
      //
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

  updateStock = async ({stockId, upc, quantity, price}) => {
    const reqBody = {
      query: `
        mutation {
          updateStock(
            updateStockInput: {
              stockId: "${inventoryInput.stockId}",
              upc: "${inventoryInput.upc}",
              quantity: ${inventoryInput.quantity},
              price: "${inventoryInput.price}"
            }
          )
          {
            item {
              title
              upc
              brand
            } 
            price
            quantity
          }
        }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      return res.data.updateStock;
    }
  }

  async chooseLocation(location) {

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
                brand
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

  registerUser = async ({username, email, password})  => {
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

  async updateInventory(inventory) {
    this.setState(({ currentLocation }) => {
      return {currentLocation: { ...currentLocation, inventory }};
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
      this.setState({ user });
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
      await this.setState({ token });
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

    const inventory = () => {
      return (
        checkAuth(
          <Inventory 
            currentLocation={this.state.currentLocation}
          />
        )
      )
    }

    const locations = () => {
      return (
        checkAuth(
          <Locations 
            user={this.state.user}
            currentLocation={this.state.currentLocation}
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

    const checkAuth = (componentToRender) => {
      if(this.state.token && this.state.user){
        return componentToRender
      } else {
        return <Redirect to='/'/>
      }
    }

    return (
      <div>
        <Box display="flex" justifyContent="flex-start">
          <Navigation 
            token={this.state.token}
            user={this.state.user}
            classes={this.props.classes}
            currentLocation={this.state.currentLocation}
            chooseLocation={this.chooseLocation}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <Switch>
            <Route exact path='/' render={landing}/>
            <Route exact path='/login' render={login}/>
            <Route exact path='/register' render={register}/>
            <Route exact path='/dashboard' render={dashboard} />
            <Route exact path='/locations' render={locations}/>
            <Route exact path='/inventory' render={inventory}/>
            <Route exact path='/inventory/add' render={addInventory}/>
            <Route exact path='/location/add' render={addLocation}/>
            <Route exact path='/checkout' render={checkout}/>
          </Switch>
        </Box>
        {this.state.token ? <NavBottom /> : null}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(App));