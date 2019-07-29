import React from 'react';

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



class Navigation extends React.Component {
  constructor() {
    super() 

    this.state = {
      isToggled: false
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.setState(state => ({
      isToggled: !state.isToggled
    }))
  }
  
  render() {
    
    return (  
      <div className={this.props.classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={() => this.toggleSidebar()} edge="start" className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon
              />
            </IconButton>
            <Typography variant="h6" className={this.props.classes.title}>
              Inventaro
            </Typography>
              <Button onClick={() => this.props.history.push(`/login`)} color="inherit">Login</Button>
              <Button onClick={() => this.props.history.push(`/register`)} color="inherit">Register</Button>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.isToggled} onClose={() => this.toggleSidebar()} >
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
    );
  }
}

export default withRouter(Navigation);