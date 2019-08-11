import React, { useState, useEffect } from 'react';
import { TextField, Button, ButtonGroup, Paper, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import BarcodeIcon from '@material-ui/icons/ViewWeek';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5, 20),
    marginTop: theme.spacing(10),
    minHeight: theme.spacing(100)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  staticInfo: {
    padding: theme.spacing(1)
  },
  buttonSpacing: {
    margin: theme.spacing(2),
  }
}));

const AddInventory = props => {
  const classes = useStyles();

  const [mode, setMode] = useState('DEFAULT');
  const [redirect, setRedirect] = useState('DEFAULT');
  const [ isSearching, setIsSearching ] = useState(false);
  const [currentStock, setCurrentStock] = useState({})

  const [inventoryInput, setInventoryInput] = useState({
    upc:'096619846016',
    price: '',
    quantity: '',
    title: '',
    stockId: ''
  })

  const [productSuggestions, setProductSuggestions] = useState({
    title: [],
    brand: [],
    price: []
  })

  useEffect(() => {
    if(props.location.params) {
      const { upc, redirect } = props.location.params;
      setInventoryInput({
        ...inventoryInput, upc
      })
      if(redirect) {
        setRedirect(redirect);
      }
    }
  }, []);


  const handleInput = property => event => {
    const value = event.target.value;
    setInventoryInput({
      ...inventoryInput, [property]: value
    })
    return
  }

  const handleUpcInput = async (event) => {
    setMode('DEFAULT');
    const upc = event.target.value;
    await setInventoryInput({...inventoryInput, upc});
  }

  useEffect(() => {
    if(inventoryInput.upc) {
      if(!isSearching) {
        setIsSearching(true);
        setTimeout(() => {
          findProduct();
          setIsSearching(false);
        }, 1000);
      }
    }
  }, [inventoryInput.upc])

  const findProduct = async () => {
    const stock = props.currentLocation.inventory.find(stock => stock.item.upc === inventoryInput.upc);
    if(stock) {
      setCurrentStock(stock);
      setInventoryInput({
        ...inventoryInput,
        title: stock.item.title,
        price: parseInt(stock.price).toFixed(2),
        quantity: stock.quantity,
        originalQuantity: stock.quantity,
        stockId: stock._id
      });
      setMode('UPDATE_STOCK');
    } else {
      const item = await getItem();
      if(item) {
        setInventoryInput({
          ...inventoryInput,
          upc: item.upc,
          title: item.title,
          brand: item.brand
        })
        setMode('CREATE_STOCK');
      } else {
        setMode('CREATE_ITEM');
        const productSuggestions = await getProductSuggestions(inventoryInput.upc)
        if(productSuggestions) {
          setProductSuggestions({
            title: productSuggestions.titleSuggestions,
            brand: productSuggestions.brandSuggestions,
            price: productSuggestions.priceSuggestions
          });
        }
      }
    }
  }

  const getItem = async () => {
    const reqBody = {
      query: `
        query {
          item(upc: "${inventoryInput.upc}") {
              title
              brand
              upc
          }
        }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      return res.data.item;
    }
  }

  const createItem = async () => {
    const reqBody = {
      query: `
        mutation {
          createItem(
            itemInput:{
              upc:"${inventoryInput.upc}",
              title:"${inventoryInput.title}",
              brand: "${inventoryInput.brand}",
            }
          ) 
          {
            upc
            title
            brand
          }
        }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      return res.data.createItem;
    }
  }

  const createStock = async () => {
    const reqBody = {
      query: `
        mutation {
          createStock(
            stockInput: {
              locationId:"${props.currentLocation._id}",
              upc:"${inventoryInput.upc}",
              price: "${inventoryInput.price}",
              quantity: ${inventoryInput.quantity}
            }
          )
          {
            item {
              title
              upc
              brand
            }
            price,
            quantity
          }
        }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      return res.data.createStock;
    }
  }

  const updateStock = async () => {
    const reqBody = {
      query: `
        mutation {
          updateStock(
            updateStockInput: {
              stockId: "${inventoryInput.stockId}",
              upc: "${inventoryInput.upc}",
              quantity: ${inventoryInput.quantity},
              price: "${inventoryInput.price}"
            }
          )
          {
            item {
              title
              upc
              brand
            } 
            price
            quantity
          }
        }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      return res.data.updateStock;
    }
  }

  const handleSubmit = async () => {
    let item;
    if(mode === 'CREATE_ITEM') {
      item = await createItem();
    }
    let inventory = props.currentLocation.inventory;
    if((mode === 'CREATE_ITEM' && item) || mode === 'CREATE_STOCK') {
      const createdStock = await await createStock();
      if(createdStock) {
        const stockIndex = inventory.push(createdStock) - 1;
        props.updateInventory(inventory);
        handleRedirect(stockIndex);
        props.history.goBack();
      }
    }
    if(mode === 'UPDATE_STOCK') {
      const updatedStock = await updateStock();
      console.log(updatedStock)
      let stockIndex
      if(updatedStock) {
        stockIndex = inventory.findIndex(stock => stock.item.upc === updatedStock.item.upc);
        inventory[stockIndex] = updatedStock;
        handleRedirect(stockIndex)
      }
    }
  }

  const handleRedirect = (stockIndex) => {
    switch(redirect) {
      case 'CHECKOUT':
        const stock = props.currentLocation.inventory[stockIndex];
        let cart = props.cart;
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
        props.history.push('/checkout');
        break;
      case 'INVENTORY':
        props.history.push({
          pathname: '/inventory',
          params: {searchInput: props.location.params.searchInput}
        });
        break;
    }
  }


  const handleSuggestionSelection = (property, value) => {
    setInventoryInput({
      ...inventoryInput, [property]: value
    });
  }

  const getProductSuggestions = async (upc) => {
    const reqBody = {
      query: `
      query {
        productSuggestions(upc: "${upc}") {
          titleSuggestions
          brandSuggestions
          priceSuggestions
        }
      }
      `
    };
    const res = await props.fetchApi(reqBody);
    if(res) {
      return res.data.productSuggestions;
    }
  }

  const suggestions = (prop) => {
    if(productSuggestions[prop]) {
      return (
        <List>
          {
            productSuggestions[prop].slice(0,2).map(suggestion => {
            return (
                <ListItem
                  button
                  onClick={() => handleSuggestionSelection(prop, suggestion)}
                  display="block"
                >
                  <ListItemText>
                    {suggestion}
                  </ListItemText>
                </ListItem>
                )
            })
          }   
        </List>
      )
    }
  }

  const upc = () => {
    return (
      <>
        <TextField
          className={classes.buttonSpacing}
          onChange={(e) => handleUpcInput(e)}
          id="search-field"
          value={inventoryInput.upc}
          placeholder="UPC"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BarcodeIcon />
              </InputAdornment>
            ),
          }}
        />
      </>
    )
  }

  const title = () => {
    if(mode === 'CREATE_ITEM') {
      return (
        <>
          <TextField
            onChange={handleInput('title')}
            id="title"
            label="Title"
            type="text"
            name="title"
            autoComplete="text"
            margin="normal"
            variant="outlined"
            value={inventoryInput.title}
          />
          {suggestions('title')}
        </>
      )
    }
    else if (inventoryInput.title) {
      return (
        <Card className={classes.staticInfo}>
          <Typography variant="h7" align="center">
            {inventoryInput.title}
          </Typography>
        </Card>
      )
    }
  }

  const brand = () => {
    if(mode === 'CREATE_ITEM') {
      return (
        <>
          <TextField
            onChange={handleInput('brand')}
            id="brand"
            label="brand"
            type="brand"
            name="title"
            autoComplete="brand"
            margin="normal"
            variant="outlined"
            value={inventoryInput.brand}
          />
          {suggestions('brand')}
        </>
      )
    }
    else if (inventoryInput.brand) {
      return <div>{inventoryInput.brand}</div>
    }
  }

  const price = () => {

    const getPriceDifference = () => {
      if(+inventoryInput.quantity) {
        const difference = (parseFloat(inventoryInput.price) - parseFloat(currentStock.price)).toFixed(2);
        if(difference > 0) {
          return (<Typography style={{color: 'green'}}>{`+${difference}`}</Typography>)
        } else if (difference < 0) {
          return (<Typography style={{color: 'red'}}>{`${difference}`}</Typography>)
        } else {
          return ''
        }
      }
    }

    if(mode !== 'DEFAULT') {
      return (
        <>
          <Box display="flex" flexDirection="row">
            <TextField
              onChange={handleInput('price')}
              id="price"
              label="Price"
              type="text"
              name="price"
              autoComplete="text"
              margin="normal"
              variant="outlined"
              value={inventoryInput.price}
            />
            <Box>
              {getPriceDifference()}
            </Box>
          </Box>
          <Box>
            {suggestions('price')}
          </Box>
        </>
      )
    }
  }

  const quantity = props => {

    const getQuantityDifference = () => {
      if(+inventoryInput.quantity) {
        const difference = +inventoryInput.quantity - +currentStock.quantity;
        if(difference > 0) {
          return (<Typography style={{color: 'green'}}>{`+${difference}`}</Typography>)
        } else if (difference < 0) {
          return (<Typography style={{color: 'red'}}>{`${difference}`}</Typography>)
        } else {
          return ''
        }
      }
    }

    if(mode !== 'DEFAULT') {
      return (
        <>
          <Box display="flex" flexDirection="row">
            <TextField
              onChange={handleInput('quantity')}
              id="quantity"
              label="Total Quantity"
              type="text"
              name="quantity"
              autoComplete="text"
              margin="normal"
              variant="outlined"
              value={inventoryInput.quantity}
            />
            <Box>
              {getQuantityDifference()}
            </Box>
          </Box>
          <Box>

          </Box>
        </>
      )
    }
  }

  const submit = () => {
    if(mode === 'UPDATE_STOCK' || mode === 'CREATE_STOCK') {
      return (
        <>
          <Button className={classes.buttonSpacing} variant="outlined" onClick={() => handleSubmit()}>Update</Button>
          <Button className={classes.buttonSpacing} variant="outlined" onClick={() => props.history.goBack()}>Cancel</Button>
        </>
      )
    }
    else if(mode === 'CREATE_ITEM') {
      return (
        <>
          <Box align="center">
            <Button className={classes.buttonSpacing} variant="outlined" onClick={() => handleSubmit()}>Create</Button>
            <Button className={classes.buttonSpacing} variant="outlined" onClick={() => props.history.goBack()}>Cancel</Button>
          </Box>
        </>
      )
    }
    else {
      return (
        <>
          <Box align="center">
            <Button className={classes.buttonSpacing} variant="outlined" onClick={() => props.history.goBack()}>Cancel</Button>
          </Box>
        </>
      )
    }
  }

  if(props.currentLocation) {
    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h5" component="h3" align="center">
            Edit Stock
          </Typography>
          <Box>
            {upc()}
          </Box>
          <Box>
            {title()}
          </Box>
          <Box>
            {brand()}
          </Box>
          <Box>
            {price()}
          </Box>
          <Box>
            {quantity()}
          </Box>
          <Box>
            {submit()}
          </Box>
        </Paper>
      </div>
    )
  } else {
    return <div>Please select a location</div>
  } 
}

export default withRouter(AddInventory);