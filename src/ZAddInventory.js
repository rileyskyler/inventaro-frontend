
import React, { useState } from 'react';
import { TextField, Button, ButtonGroup } from '@material-ui/core';

const AddInventory = props => {
  
  const [inventoryInput, setInventoryInput] = useState({
    upc:'096619846016',
    price: '0.00',
    quantity: '0',
    title: ''
  })

  const [inventoryToggles, setInventoryToggles] = useState({
    price: false,
    quantity: false,
    mode: 'default',
    itemExits: null
  })

  const [productInformation, setProductInformation] = useState({
    titleSuggestions: [],
    brandSuggestions: [],
    suggestedPrice: ""
  })

  const handleUpcInput = option => event => {
    const upc = event.target.value;
    if(upc.length <= 12) {
      setInventoryInput({...inventoryInput, upc})
      if(upc.length === 12) {
        getStock();
      } 
    }
  }

  const getProductInformation = async () => {
    const reqBody = {
      query: `
        query {
          productInformation(upc: "${'096619846016'}") {
            titleSuggestions
            brandSuggestions
            suggestedPrice
          }
        }
      `
    };
    const { data: { productInformation } } = await props.fetchApi(reqBody, props.token);
    if(productInformation) {
      console.log(productInformation)
      setProductInformation({...productInformation});
    }
  }

  const getItem = () => {
    const reqBody = {
      query: `
        query {
          productInformation(upc: "${'096619846016'}") {
            titleSuggestions
            brandSuggestions
            suggestedPrice
          }
        }
      `
    };
    const { data: { productInformation } } = await props.fetchApi(reqBody, props.token);
    if(productInformation) {
      console.log(productInformation)
      setProductInformation({...productInformation});
    }
  }

  const getStock = async () => {
    const stock = props.currentLocation.inventory.find(stock => stock.item.upc === inventoryInput.upc);
    if(stock) {
      setInventoryInput({
        ...inventoryInput,
        price: stock.price,
        quantity: stock.quantity
      })
      setInventoryToggles({
        price: true,
        quantity: true,
        mode: 'update'
      })
    }
    else {
      // change input mode
      setInventoryToggles({...inventoryToggles, mode: 'create'});
      // get suggtions from api
      //get item
      const item = await getItem();
      // getProductInformation();
      // render suggestions
    }

  }

  const handleZ = (property, value) => {
    console.log(property, value)
    setInventoryInput({
      ...inventoryInput, [property]: value
    })
  }

  const upc = () => {
    if(props.currentLocation) {
      return (
        <TextField
          onChange={handleUpcInput()}
          id="upc"
          label="upc"
          type="text"
          name="upc"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={inventoryInput.upc}
        />
      )
    }
    else {
      return <div>Please select a location</div>
    }
  }

  const price = () => {
    if(inventoryToggles.mode !== 'default') {
      return (
        <>
          <TextField
            // onChange={handleUpcInput()}
            id="price"
            label="price"
            type="text"
            name="price"
            autoComplete="text"
            margin="normal"
            variant="outlined"
            value={inventoryInput.price}
          />
          { 
            productInformation.suggestedPrice
            ? 
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => handleZ('price', productInformation.suggestedPrice)}
              >
                {productInformation.suggestedPrice}
              </Button>
            </ButtonGroup>
            :
            null
          }
        </>
      )
    }
  }

  const quantity = () => {
    if(inventoryToggles.mode !== 'default') {
      return (
        <TextField
          // onChange={handleUpcInput()}
          id="quantity"
          label="quantity"
          type="text"
          name="quantity"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={inventoryInput.quantity}
        />
      )
    }
  }

  const title = () => {
    if(inventoryToggles.mode !== 'default') {
      return (
        <>
        <TextField
          // onChange={handleUpcInput()}
          id="title"
          label="title"
          type="text"
          name="title"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={inventoryInput.title}
          />
          <ButtonGroup size="small" aria-label="small outlined button group">
            {
              productInformation.titleSuggestions.map(suggestion => {
                return (
                  <Button
                    onClick={() => handleZ('title', suggestion)}
                  >
                  {suggestion}
                  </Button>
                )
              })
            }
          </ButtonGroup>
        </>
      )
    }
  }

  const brand = () => {
    if(inventoryToggles.mode !== 'default') {
      return (
        <>
          <TextField
            // onChange={handleUpcInput()}
            id="brand"
            label="brand"
            type="text"
            name="brand"
            autoComplete="text"
            margin="normal"
            variant="outlined"
            value={inventoryInput.brand}
          />
          <ButtonGroup size="small" aria-label="small outlined button group">
            {
              productInformation.brandSuggestions.map(suggestion => {
                return (
                  <Button
                    onClick={() => handleZ('brand', productInformation.suggestedPrice)}
                  >
                    {suggestion}
                  </Button>
                )
              })
            }
          </ButtonGroup>
        </>
      )
    }
  }

  const submit = () => {
    if(inventoryToggles.mode === 'update') {
      return (
        <Button onClick={() => console.log('Update')}>Update</Button>
      )
    }
    else if(inventoryToggles.mode === 'create') {
      return (
        <Button onClick={() => console.log('Update')}>Create</Button>
      )
    }
  }


  return (
    <div>
      <h3>Edit Inventory</h3>
      <form noValidate autoComplete="off">
        {upc()}
        {title()}
        {price()}
        {quantity()}
        {brand()}
        {submit()}

      </form>
    </div>
  )
}

export default AddInventory;
