import React, { useState } from 'react';
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

const TAX_RATE = 0.07;

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


function priceFormat(price) {
  return `${parseInt(price).toFixed(2)}`;
}

const Prompt = props => {
  console.log(props)
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Item not in inventory!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This product is not in this locations inventory.
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={props.handleClose} color="primary">
            Add Product Manually
          </Button>
          <Button onClick={props.handleAddInventory} color="primary">
            Add product to inventory
          </Button>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Checkout = props => {
  console.log(props)
  
  const [upcInput, setUpcInput] = useState('');
  const [cart, setCart] = useState([]);
  const [prompts, togglePrompts] = useState({
    noStock: false
  })
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const togglePrompt = (prompt) => {

    switch (prompt) {
      case 'NO_STOCK':
        setOpen(true)
    }
  }

  const handleUpc = option => event => {
    const upc = event.target.value;
    setUpcInput(upc);
    if (upc.length === 12) {
      const stock = props.currentLocation.inventory.find(stock => stock.item.upc === upc);
      if(stock) {
        addToCheckout(stock);
        setUpcInput('');
      } else {
        togglePrompt('NO_STOCK')
      }
    }
  }

  const addToCheckout = (stock) => {
    let cart = props.cart;
    const productIndex = cart.findIndex(product => stock.item.upc === product.upc);
    if(productIndex > -1) {
      props.cart[productIndex].quantity++
      props.updateCart([...cart]);
    } else {
      console.log(stock)
      props.updateCart(
        [
          ...cart,
          {
            title: stock.item.title,
            price: stock.price,
            quantity: 1,
            upc: stock.item.upc
          }
        ]
      )
    }
  }


  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = () => {
    console.log('handle')
    setOpen(false);
  }

  const handleAddInventory = () => {
    props.history.push({
      pathname: '/add-inventory',
      params: {upc: upcInput}
    })
  }


  return (
    <div>
      <TextField
        onChange={handleUpc()}
        id="upc"
        label="upc"
        type="text"
        name="upc"
        autoComplete="text"
        margin="normal"
        variant="outlined"
        autoFocus
        value={upcInput}
      />
      <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.cart.map(product => {
                
                console.log(product)
                return (
                <TableRow key={product.title}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell align="right">- {product.quantity} +</TableCell>
                  <TableCell align="right">{priceFormat(product.price)}</TableCell>
                </TableRow>
              )})}

              {/* <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">{priceFormat(invoiceSubtotal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                <TableCell align="right">{priceFormat(invoiceTaxes)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{priceFormat(invoiceTotal)}</TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </Paper>
        <Prompt open={open} handleAddInventory={handleAddInventory} handleClose={handleClose} />
    </div>
  )
}

export default withRouter(Checkout);