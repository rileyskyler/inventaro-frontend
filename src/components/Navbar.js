import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import NavigationIcon from '@material-ui/icons/Navigation';
import StoreIcon from '@material-ui/icons/Store';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function ButtonChoice(props) {
  const classes = useStyles();
  if(props.location === '/') {
    return (
      <Box>
        <Button onClick={() => props.history.push('/login')} color="inherit">Login</Button>
        <Button onClick={() => props.history.push('/register')} color="inherit">Register</Button>
      </Box>
    )
  } else if (props.currentLocation) {
    return (
      <Box>
        <Button onClick={() => props.history.push('/locations')} variant="outlined" color="inherit" className={classes.button}>
          <StoreIcon className={classes.extendedIcon} />
          {props.currentLocation.title}
        </Button>
      </Box>
    )
  }
  else {
    return (
      <Box></Box>
    )
  }
}

function Navbar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Inventaro
          </Typography>
          <ButtonChoice
            location={props.location.pathname}
            history={props.history}
            currentLocation={props.currentLocation}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Navbar);