import React, { useState, useEffect } from 'react';
import { TextField, Button, ButtonGroup } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const AddInventory = props => {
  const [mode, setMode] = useState('DEFAULT');

  const [inventoryInput, setInventoryInput] = useState({
    upc:'09661984601',
    price: '0.00',
    quantity: '0',
    title: '',
    stockId: ''
  })

  const [productSuggestions, setProductSuggestions] = useState({
    title: [],
    brand: [],
    price: []
  })

  const handleInput = property => event => {

    setInventoryInput({
      ...inventoryInput, [property]: event.target.value
    })
  }

  const handleUpcInput = (event) => {
    setMode('DEFAULT');
    const upc = event.target.value;
    setInventoryInput({...inventoryInput, upc});
  }

  const findProduct = async () => {
    if(inventoryInput.upc.length !== 12) {
      return;
    }
    const stock = props.currentLocation.inventory.find(stock => stock.item.upc === inventoryInput.upc);
    if(stock) {
      setInventoryInput({
        ...inventoryInput,
        title: stock.item.title,
        price: stock.price,
        quantity: stock.quantity,
        stockId: stock._id
      });
      setMode('UPDATE_STOCK')
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
        const productSuggestions = await getProductSuggestions(upc);
        if(productSuggestions) {
          setProductSuggestions({
            ...productSuggestions,
            title: productSuggestions.titleSuggestions,
            brand: productSuggestions.brandSuggestions,
            price: [productSuggestions.priceSuggestion]
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
    console.log(inventoryInput)
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
      if(!item) {
        throw new Error('Item not created!')
      }
    }
    let inventory = props.currentLocation.inventory;
    if((mode === 'CREATE_ITEM' && item) || mode === 'CREATE_STOCK') {
      const createdStock = await createStock();
      if(createdStock) {
        inventory.push(createdStock);
        props.updateInventory(inventory);
        props.history.push('/dashboard');
      }
    }
    if(mode === 'UPDATE_STOCK') {
      const updatedStock = await updateStock();
      if(updatedStock) {
        const stockIndex = inventory.findIndex((stock) => {
          return stock.item.upc === updatedStock.item.upc;
        })
        inventory[stockIndex] = updatedStock;
        props.updateInventory(inventory);
      }
      props.history.push('/dashboard');
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
          priceSuggestion
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
        <ButtonGroup size="small" aria-label="small outlined button group">
          {
            productSuggestions[prop].map(suggestion => {
            return (
                <Button
                  key={suggestion}
                  onClick={() => handleSuggestionSelection(prop, suggestion)}
                >
                  {suggestion}
                </Button>
            )
          })}
        </ButtonGroup>         
      )
    }
  }

  const upc = () => {
    return (
      <>
        <TextField
          onChange={(e) => handleUpcInput(e)}
          id="upc"
          label="upc"
          type="text"
          name="upc"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={inventoryInput.upc}
        />
        <Button onClick={() => findProduct(inventoryInput.upc)}>Find</Button>
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
            label="title"
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
      return <div>{inventoryInput.title}</div>
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
    if(mode !== 'DEFAULT') {
      return (
        <>
          <TextField
            onChange={handleInput('price')}
            id="price"
            label="price"
            type="text"
            name="price"
            autoComplete="text"
            margin="normal"
            variant="outlined"
            value={inventoryInput.price}
          />
          {suggestions('price')}
        </>
      )
    }
  }

  const quantity = () => {
    if(mode !== 'DEFAULT') {
      return (
        <>
          <TextField
            onChange={handleInput('quantity')}
            id="quantity"
            label="quantity"
            type="text"
            name="quantity"
            autoComplete="text"
            margin="normal"
            variant="outlined"
            value={inventoryInput.quantity}
          />
        </>
      )
    }
  }

  const submit = () => {
    if(mode === 'UPDATE_STOCK' || mode === 'CREATE_STOCK') {
      return (
        <Button onClick={() => handleSubmit()}>Update</Button>
      )
    }
    else if(mode === 'CREATE_ITEM') {
      return (
        <Button onClick={() => handleSubmit()}>Create</Button>
      )
    }
  }

  if(props.currentLocation) {
    return (
      <div>
        <h3>Edit Inventory</h3>
        <form noValidate autoComplete="off">
          {upc()}
          {title()}
          {brand()}
          {price()}
          {quantity()}
          {submit()}
        </form>
      </div>
    )
  } else {
    return <div>Please select a location</div>
  } 
}

export default withRouter(AddInventory);