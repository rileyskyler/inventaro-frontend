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
  const [upcInput, setUpcInput] = useState('');
  const [cart, setCart] = useState([]);
  const [prompts, togglePrompts] = useState({
    noStock: false
  })
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {
    console.log(props)
  }, []);

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
      cart[productIndex].quantity++
      props.updateCart(cart);
    } else {
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
    setOpen(false);
  }

  const handleAddInventory = () => {
    props.history.push({
      pathname: '/add-inventory',
      params: {
        upc: upcInput,
        redirect: 'CHECKOUT'
      }
    })
  }

  const adjustProductQuantity = (productIndex, operand) => {
    const cart = props.cart;
    switch(operand){
      case '+':
        cart[productIndex].quantity++;
        props.updateCart(cart);
        break;
      case '-':
        cart[productIndex].quantity--;
        props.updateCart(cart);
        break;
    }
  }

  let subtotal = 0, taxes = 0, total = 0;
  if(props.cart.length) {
    subtotal = props.cart.reduce((acc, {price, quantity}) => acc + (price * quantity), 0)
    taxes = 0.00 * subtotal;
    total = subtotal + taxes;
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
              {
                props.cart.map((product, i) => (
                  <TableRow key={product.title}>
                    <TableCell>{product.title.slice(0, 50) + '...'}</TableCell>
                    <TableCell align="right">
                      <div onClick={() => adjustProductQuantity(i, '-')}> - </div>
                      {product.quantity}
                      <div onClick={() => adjustProductQuantity(i, '+')}> + </div>
                       </TableCell>
                    <TableCell align="right">{priceFormat(product.price)}</TableCell>
                  </TableRow>
                ))
                
              }
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">{priceFormat(subtotal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell align="right">{`${(.00 * 100).toFixed(0)} %`}</TableCell>
                <TableCell align="right">{priceFormat(taxes)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{priceFormat(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <Prompt open={open} handleAddInventory={handleAddInventory} handleClose={handleClose} />
    </div>
  )
}

export default withRouter(Checkout);