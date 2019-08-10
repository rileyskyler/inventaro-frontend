import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, ButtonGroup } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BarcodeIcon from '@material-ui/icons/ViewWeek';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(10)
  },
  table: {
    minWidth: 700,
  },
  buttonSpacing: {
    margin: theme.spacing(3),
  },
  extendedIcon: {
    marginRight: theme.spacing(2),
  }
}));

const InventoryList = props => {
  const inventoryList = props.inventory.filter(({ item }) => Object.keys(item).find(prop => item[prop].toLowerCase().includes(props.searchInput.toLowerCase())))
  return inventoryList.map((stock, i) => {
    return (
      <TableRow key={i}>
        <TableCell align="center">
          <EditIcon onClick={() => props.handleEditClick(stock.item.upc)}/>
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
  
  const classes = useStyles();
  
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if(props.location.params) {
      setSearchInput(props.location.params.searchInput)
    }
  }, []);

  const handleSearch = option => event => {
    setSearchInput(event.target.value);
  }

  const handleEditClick =  (upc) => {
    props.history.push({
      pathname: '/inventory/add',
      params: {
        upc,
        searchInput,
        redirect: 'INVENTORY'
      }
    })
  }

  if(props.currentLocation) {
    return (
      <div>
        <Paper className={classes.root}>
          <Box align="center">
            <TextField
              className={classes.buttonSpacing}
              placeholder="UPC"
              id="search-field"
              onChange={handleSearch()}
              value={searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BarcodeIcon/>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              size="small"
              className={classes.buttonSpacing}
              onClick={() =>  props.history.push('/inventory/add')}
            >
              <AddCircleIcon className={classes.extendedIcon} />
              Add Inventory
            </Button>
          </Box>
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
}

export default withRouter(Inventory);