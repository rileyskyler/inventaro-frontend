import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 20),
    marginTop: theme.spacing(40)
  },
  info: {
    margin: theme.spacing(3)
  }
}));

function Account(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Box className={classes.info} align="center">
        <Typography variant="h6" align="center">
          Username
        </Typography>
        <Typography variant="caption" align="center">
          {props.user.username}
        </Typography>
      </Box>
      <Box className={classes.info} align="center">
        <Typography variant="h6" align="center">
          Email
        </Typography>
        <Typography variant="caption" align="center">
          {props.user.username}
        </Typography>
      </Box>
      <Box className={classes.info} align="center">
        <Button
          variant="outlined"
          align="center"
          onClick={() => props.logoutUser()}
        >
          Log Out
        </Button>
      </Box>
    </Paper>
  )
}

export default Account;