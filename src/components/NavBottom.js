import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewListIcon from '@material-ui/icons/ViewList';
import AccountIcon from '@material-ui/icons/AccountCircle';
import LocationIcon from '@material-ui/icons/Store';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

const NavBottom = props => {
  const classes = useStyles();
  // const [value, setValue] = React.useState(0);
  const locations = ['/inventory', '/checkout', '/locations', '/account'];
  
  const handleSetValue = (newValue) => {
    props.history.push(locations[newValue])
  }

  const getValue = () => {
    return locations.findIndex(i => i === props.location.pathname)
  }

  return (
    <BottomNavigation
      value={getValue()}
      onChange={(event, newValue) => {
        handleSetValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Inventory" icon={<ViewListIcon />} />
      <BottomNavigationAction label="Checkout" icon={<ShoppingCartIcon />} />
      <BottomNavigationAction label="Locations" icon={<LocationIcon />} />
      <BottomNavigationAction label="Account" icon={<AccountIcon />} />
    </BottomNavigation>
  );
}

export default withRouter(NavBottom);