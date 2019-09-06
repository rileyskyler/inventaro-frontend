import React from "react";
import Navigation from "./components/Navbar";
import Landing from "./components/Landing";
import Inventory from "./components/Inventory";
import AddInventory from "./components/AddInventory";
import AddLocation from "./components/AddLocation";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Checkout from "./components/Checkout";
import Locations from "./components/Locations";
import NavBottom from "./components/NavBottom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import JoinLocation from "./components/JoinLocation";
import Notifications from "./components/Notifications";

const styles = makeStyles(theme => ({
  root: {
    height: "100vh",
    width: "100vw"
  }
}));

const MODE = process.env.NODE_ENV;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      token: "",
      currentLocation: null,
      cart: []
    };

    this.fetchApi = this.fetchApi.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.chooseLocation = this.chooseLocation.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.getUser = this.getUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  fetchApi(reqBody) {
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.state.token}`
    };
    let res;
    try {
      const url =
        MODE === "production"
          ? "inventaro.io/api"
          : "http://localhost:1337/api";
      res = fetch(url, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers
      });
      return res.json();
    } catch (err) {
      throw err;
    }
  }

  chooseLocation(location) {
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
    const res = this.fetchApi(reqBody);
    if (res) {
      const updatedLocation = res.data.location;
      this.setState({ currentLocation: updatedLocation });
    }
  }

  logoutUser() {
    this.setState({ user: null, currentLocation: null, token: null });
    this.props.history.push("/");
  }

  registerUser({ username, email, password }) {
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
    const res = this.fetchApi(reqBody);
    if (res) {
      this.loginUser({ email, password });
    }
  }

  updateInventory(inventory) {
    this.setState(({ currentLocation }) => {
      return { currentLocation: { ...currentLocation, inventory } };
    });
  }

  updateCart(cart) {
    this.setState({ cart });
  }

  getUser() {
    const reqBody = {
      query: `
        query{ user{ username email locations{ _id title } } }
      `
    };
    const res = this.fetchApi(reqBody);
    if (res) {
      const user = res.data.user;
      this.setState({ user });
      return;
    }
  }

  loginUser({ email, password }) {
    const reqBody = {
      query: `
        query{
          login(
            loginInput:{ 
              email:"${email}"
              password: "${password}"
            }
          )
          {token}
        }
      `
    };
    const res = this.fetchApi(reqBody);
    if (res.data) {
      const token = res.data.login.token;
      this.setState({ token });
      this.getUser();
    }
    return res;
  }

  render() {
    const landing = () => {
      return <Landing />;
    };

    const login = () => {
      return <Login loginUser={this.loginUser} token={this.state.token} />;
    };

    const register = () => {
      return <Register registerUser={this.registerUser} />;
    };

    const checkout = () => {
      return checkAuth(
        <Checkout
          user={this.state.user}
          cart={this.state.cart}
          updateCart={this.updateCart}
          currentLocation={this.state.currentLocation}
        />
      );
    };

    const inventory = () => {
      return checkAuth(
        <Inventory currentLocation={this.state.currentLocation} />
      );
    };

    const locations = () => {
      return checkAuth(
        <Locations
          user={this.state.user}
          currentLocation={this.state.currentLocation}
          chooseLocation={this.chooseLocation}
        />
      );
    };

    const addInventory = () => {
      return checkAuth(
        <AddInventory
          user={this.state.user}
          currentLocation={this.state.currentLocation}
          updateInventory={this.updateInventory}
          fetchApi={this.fetchApi}
          cart={this.state.cart}
          updateCart={this.updateCart}
        />
      );
    };

    const addLocation = () => {
      return checkAuth(
        <AddLocation
          fetchApi={this.fetchApi}
          user={this.state.user}
          currentLocation={this.state.currentLocation}
          getUser={this.getUser}
        />
      );
    };

    const account = () => {
      return checkAuth(
        <Account logoutUser={this.logoutUser} user={this.state.user} />
      );
    };

    const joinLocation = () => {
      return checkAuth(
        <JoinLocation
          fetchApi={this.fetchApi}
          user={this.state.user}
          currentLocation={this.state.currentLocation}
          getUser={this.getUser}
        />
      );
    };

    const checkAuth = componentToRender => {
      if (this.state.token && this.state.user) {
        return componentToRender;
      } else {
        return <Redirect to="/" />;
      }
    };

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
            <Route exact path="/" render={landing} />
            <Route exact path="/login" render={login} />
            <Route exact path="/register" render={register} />
            <Route exact path="/locations" render={locations} />
            <Route exact path="/inventory" render={inventory} />
            <Route exact path="/inventory/add" render={addInventory} />
            <Route exact path="/location/add" render={addLocation} />
            <Route exact path="/location/join" render={joinLocation} />
            <Route exact path="/checkout" render={checkout} />
            <Route exact path="/account" render={account} />
          </Switch>
        </Box>
        {this.state.token ? <NavBottom /> : null}
        {/* <Notifications /> */}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(App));
