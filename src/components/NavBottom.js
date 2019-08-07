import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewListIcon from '@material-ui/icons/ViewList';
import AccountIcon from '@material-ui/icons/AccountCircle';

import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: '100%',
    bottom: 0
  },
});

const NavBottom = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleSetValue = (newValue) => {
    setValue(newValue)
    switch(newValue) {
      case 0:
        console.log('inventory')
        props.history.push('/inventory');
        break;
      case 1:
        console.log('checkout')
        props.history.push('/checkout');
        break;
    }
  }

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        handleSetValue(newValue);
      }}
      showLabels
      style={{
        width: '100%',
        position: 'fixed',
        bottom: 0
      }}
    >
      <BottomNavigationAction label="Inventory" icon={<ViewListIcon />} />
      <BottomNavigationAction label="Checkout" icon={<ShoppingCartIcon />} />
      <BottomNavigationAction label="Account" icon={<AccountIcon />} />
    </BottomNavigation>
  );
}

export default withRouter(NavBottom);