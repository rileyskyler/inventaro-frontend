import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(5),
    marginTop: theme.spacing(5),
    overflowX: 'auto',
  },
  list: {
    width: '100%',
    padding: theme.spacing(5),
    marginTop: theme.spacing(5),
    overflowX: 'auto',
  },
  table: {
    width: theme.spacing(85),
  },
  extendedIcon: {
    marginRight: theme.spacing(2),
  },
  buttonSpacing: {
    margin: theme.spacing(5),
  },
  emptyDialog: {
    padding: theme.spacing(3)
  }
}));

function Locations(props) {
  const classes = useStyles();

  const getLocationList = () => {
    if(props.user.locations.length){
      return (
        <List component="nav" aria-label="contacts">
        {
          props.currentLocation
          ?
          (
            <>
              <Typography>
              Current Location
              </Typography>
              <ListItem button>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary={props.currentLocation.title} />
              </ListItem>
            </>
          )
          : <Box></Box>
        }
          <Typography>
            Available Locations
          </Typography>
          {
            props.user.locations.filter(({ title }) => title !== ((props.currentLocation || {}).title)).map((location, i) => (
              <ListItem key={i} button onClick={() =>  props.chooseLocation(location)}>
                <ListItemIcon>
                  <CheckCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary={location.title} />
              </ListItem>
            ))
          }
        </List>
      )
    } else {
      return (
        <Paper className={classes.emptyDialog}>
          <Typography>
            Please create or join a location.
          </Typography>
        </Paper>
      )
    }
  }
 
  return (
    <Box className={classes.root}>
      <Box align="center">
        <Button
          variant="outlined"
          size="small" className={classes.buttonSpacing}
          onClick={() => props.history.push('location/add')}
        >
          <AddCircleIcon className={classes.extendedIcon} />
          Add Location
        </Button>
        <Button
          variant="outlined"
          size="small" className={classes.buttonSpacing}
          onClick={() => props.history.push('location/join')}
        >
          <AddCircleIcon className={classes.extendedIcon} />
          Join Location
        </Button>
        {getLocationList()}
      </Box>
    </Box>
  )
}


export default withRouter(Locations);