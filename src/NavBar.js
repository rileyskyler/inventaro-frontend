import React from 'react';

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

import { BrowserRouter } from 'react-router-dom';



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
    
    return (
      // <div>
      //   <button onClick={this.handleClick}>Button Swag</button>
      //   <span>{this.state.isToggled + ''}</span>
      // </div>
      
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

    );
  }
}

export default NavBar;