import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const AddInventory = props => {
  
  const [inventoryInput, setInventoryInput] = useState({
    upc:'',
    price: '',
    quantity: null
  })

  const handleUpcInput = option => event => {
    const upc = event.target.value;
    if(upc.length <= 12) {
      setInventoryInput({...inventoryInput, upc})
      if(upc.length === 12) {
        console.log('12')
        getUpc();
      } 
    }
  }

  const getUpc = () => {
    console.log('get upc')
    return <div>test</div>
  }

  return (
    <div>
      <h3>Add Inventory</h3>
      <form noValidate autoComplete="off">
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
        {/* <TextField
          onChange={handleInventoryInput('price')}
          id="price"
          label="price"
          type="text"
          name="price"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={inventoryInput.price}
        />
        <TextField
          onChange={handleInventoryInput('quantity')}
          id="quantity"
          label="quantity"
          type="text"
          name="quantity"
          autoComplete="text"
          margin="normal"
          variant="outlined"
          value={inventoryInput.quantity}
        /> */}
        {/* <Button onClick={() => console.log('farts')}>Add</Button> */}
      </form>
    </div>
  )
}

export default AddInventory;
