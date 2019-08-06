import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, ButtonGroup } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
}));

const InventoryList = props => {
  console.log(props)
  // const r = props.inventory.filter(stock => Object.keys(stock.item).find(prop => prop.toUpperCase().includes(props.searchInput.toUpperCase())))
  const r = props.inventory.filter(({ item }) => Object.keys(item).find(prop => item[prop].toLowerCase().includes(props.searchInput.toLowerCase())))
  console.log(r)
  return r.map(stock => {
    return (
      <TableRow key={stock._id}>
        <TableCell align="center">
          <EditIcon key={stock._id} onClick={() => props.handleEditClick(stock.item.upc)}/>
        </TableCell>
        <TableCell align="center">{stock.item.title}</TableCell>
        <TableCell align="center">{stock.item.brand}</TableCell>
        <TableCell align="center">{stock.price}</TableCell>
        <TableCell align="right">{stock.quantity}</TableCell>
        <TableCell align="right">{stock.item.upc}</TableCell>
      </TableRow>
    )
  }
  )
}

const Inventory = props => {


  const [searchInput, setSearchInput] = useState('');

  const classes = useStyles();

  useEffect(() => {
    console.log(props)
  }, []);



  const handleSearch = option => event => {
    setSearchInput(event.target.value);
  }

  const handleEditClick =  (upc) => {
    props.history.push({
      pathname: '/add-inventory',
      params: {
        upc,
        mode: 'INVENTORY'
      }
    })
  }

  return (
    <div>
              <TextField
          onChange={handleSearch()}
          id="upc"
          label="upc"
          type="text"
          name="upc"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={searchInput}
        />
      <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Product</TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">UPC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <InventoryList
                inventory={props.currentLocation.inventory}
                searchInput={searchInput}
                handleEditClick={handleEditClick}
              />
            </TableBody>
          </Table>
        </Paper>
    </div>
  )
  }

export default withRouter(Inventory);