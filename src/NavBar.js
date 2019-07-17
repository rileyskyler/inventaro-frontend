import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';

import Landing from './Landing';
import Login from './Login';
import SignUp from './SignUp';

import {
    BrowserRouter,
    Link,
    Route
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

class NavBar extends React.Component {
  constructor() {
    super() 

    this.state = {
      isToggled: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggled: !state.isToggled
    }))
  }
  
  render() {
    
    console.log(this.props.classes)
    return (
      // <div>
      //   <button onClick={this.handleClick}>Button Swag</button>
      //   <span>{this.state.isToggled + ''}</span>
      // </div>
      <BrowserRouter>
        <div className={this.props.classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={this.props.classes.title}>
                Inventaro
              </Typography>
                <Button onClick={() => this.handleClick()} color="inherit">Login</Button>
                <Button onClick={() => this.handleClick()} color="inherit">Signup</Button>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <Paper className={this.props.classes.root}>
            <Typography variant="h5" component="h3">
              Login
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your application.
            </Typography>
          </Paper>
        </div>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(NavBar);