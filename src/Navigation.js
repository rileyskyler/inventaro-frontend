import React, { useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import { withRouter } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



// const simpleMenu = () => {

// }
 


class Navigation extends React.Component {

  constructor() {
    super()

    this.state ={
      isSidebarToggled: false,
    }
  }
  
  toggleSidebar() {
    this.setState({isSidebarToggled: !this.state.isSidebarToggled})
  }
  
  

  render() {
    
    
    const landingNav = () => {
      return (  
        <div className={this.props.classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={this.props.classes.title}>
                Inventaro
              </Typography>
                <Button onClick={() => this.props.history.push(`/login`)} color="inherit">Login</Button>
                <Button onClick={() => this.props.history.push(`/register`)} color="inherit">Register</Button>
            </Toolbar>
          </AppBar>
        </div>
      )
    }

  const dashboardNav = () => {
    return (  
      <div className={this.props.classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={() => this.toggleSidebar()} edge="start" className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon
              />
            </IconButton>
            <Typography onClick={() => this.props.history.push(`/`)} variant="h6" className={this.props.classes.title}>
              Inventaro
            </Typography>
              <Button
                onClick={() => this.props.history.push(`/dashboard`)} color="inherit">
                Dashboard
              </Button>
              {/* {SimpleMenu} */}
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.isSidebarToggled} onClose={() => this.toggleSidebar()} >
          <Typography variant="h6" className={this.props.classes.title}>
              Inventaro
          </Typography>
          <List>
            <ListItem button onClick={() => this.props.history.push(`/add-inventory`)}>
              <ListItemText primary="Add Inventory" />
            </ListItem>
            <ListItem button onClick={() => this.props.history.push(`create-location`)}>
              <ListItemText primary="Create Location" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    )
  }

  if(this.props.user) {
    return dashboardNav()
  }
  else {
    return landingNav()
  }

  
}


}


export default withRouter(Navigation);