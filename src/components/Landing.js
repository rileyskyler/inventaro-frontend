import React, { useState, useEffect } from "react";
// import ReactMarkdown from 'react-markdown';

import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8)
  }
}));

function Landing() {
  const classes = useStyles();

  // const [ markdown, setMarkdown ] = useState('');

  // useEffect(() => {
  //     const path = require('../Inventaro.md')
  //     fetch(path)
  //       .then(response => {
  //           return response.text()
  //         })
  //         .then(text => {
  //             setMarkdown(text)
  //         })
  // })

  return (
    <div className={classes.root}>
      test
      {/* <ReactMarkdown 
        source={markdown}
      /> */}
    </div>
  );
}

export default withStyles(useStyles)(Landing);
