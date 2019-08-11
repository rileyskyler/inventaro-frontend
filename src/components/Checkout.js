import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, ButtonGroup, Typography } from '@material-ui/core';
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
import Box from '@material-ui/core/Box';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import BarcodeIcon from '@material-ui/icons/ViewWeek';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(25),
    marginBottom: theme.spacing(10),
    overflowX: 'auto',
  },
  table: {
    width: theme.spacing(85),
  },
  section: {
    margin: theme.spacing(1)
  },
  inputRoot: {
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(10),
    overflowX: 'auto',
    position: 'fixed',
    left: 0
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: '40px',
    textAlign: 'center'
  },
  iconButton: {
    padding: 10,
    height: '100%'
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  purchase: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  },
  payButton: {
    margin: theme.spacing(5)
  }
}))



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
        <DialogTitle id="alert-dialog-title">Item not found</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            A product with this UPC is not found at this location. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Add Manually
          </Button>
          <Button onClick={props.handleAddInventory} color="primary">
            Add Inventory
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
        addToCart(stock);
        setUpcInput('');
      } else {
        togglePrompt('NO_STOCK')
      }
    }
  }

  const addToCart = (stock) => {
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
            brand: stock.item.brand,
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
    setUpcInput('')
    setOpen(false);
  }

  const handleAddInventory = () => {
    props.history.push({
      pathname: '/inventory/add',
      params: {
        upc: upcInput,
        redirect: '/checkout'
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
      <Paper className={classes.inputRoot}>
        <IconButton className={classes.iconButton}>
          <BarcodeIcon/>
        </IconButton>
        <InputBase 
          onChange={handleUpc()}
          id="upc"
          label="upc"
          type="text"
          name="upc"
          variant="outlined"
          autoComplete="text"
          margin="normal"
          position="fixed"
          placeholder="UPC"
          autoFocus
          value={upcInput}
          className={classes.input}
        />
      </Paper>
      <Paper className={classes.root}>
        <Box>
        {
          props.cart.length
          ?
          (
            <>
              <Table>
                <TableHead >
                  <TableCell>Product</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                </TableHead>
                <TableBody>
                  {
                    props.cart.map((product, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          {
                            product.title.length >= 40
                            ? product.title.slice(0, 40) + '...'
                            : product.title
                          }
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <RemoveIcon 
                            style={{fontSize: 15, marginRight: '5'}} 
                            onClick={() => adjustProductQuantity(i, '-')}
                          />
                          {product.quantity}
                          <AddIcon 
                            style={{fontSize: 15, marginLeft: '5'}}
                            onClick={() => adjustProductQuantity(i, '+')}
                          />
                          </TableCell>
                        <TableCell>{product.price}</TableCell>
                      </TableRow>
                    ))  
                  }
                </TableBody>
              </Table>
              <Table className={classes.purchase}>
              <TableBody>
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
            <Box align="center">
              <Button
                variant="outlined"
                color="secondary"
                className={classes.payButton}
                onChange={() => props.updateCart([])}
              >
                Pay {priceFormat(total)}
              </Button>
              <Button
                variant="outlined"
                className={classes.payButton}
                onChange={() => props.updateCart([])}
              >
                Cancel
              </Button>
            </Box>
            </>
          )
          :
          (
            <Typography>Cart is empty.</Typography>
          )
        }
        </Box>
        </Paper>
        <Prompt open={open} handleAddInventory={handleAddInventory} handleClose={handleClose} />
    </div>
  )
}

export default withRouter(Checkout);