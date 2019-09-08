import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 20),
    marginTop: theme.spacing(50)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

function AddLocation(props) {

  const classes = useStyles();

  const [locationInput, setLocationInput] = useState({
    title: ''
  });

  const handleLocationInput = option => event => {
    setLocationInput({ ...locationInput, [option]: event.target.value.toUpperCase() });
  }

  const addLocation = async () => {
    const reqBody = {
      query: `
        mutation {
          createLocation(locationInput: {title: "${locationInput.title}"}) {
            title
          }
        }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      props.getUser();
      props.history.goBack()
    }
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3" align="center">
          Create Location
        </Typography>
        <Box>
          <TextField
            onChange={handleLocationInput('title')}
            id="title"
            label="title"
            type="text"
            name="Add Location"
            autoComplete="text"
            margin="normal"
            variant="outlined"
            value={locationInput.title}
          />
        </Box>
        <Box>
          <Button onClick={() => addLocation(locationInput)}>Register</Button>
          <Button onClick={() => props.history.goBack()}>Cancel</Button>
        </Box>
      </Paper>
    </div>
  )
}

export default withRouter(AddLocation);