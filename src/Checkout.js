import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const AddInventory = props => {
  const [checkoutInput, setCheckoutInput] = useState({
    upc: ''
  })

  const handleUpcInput = option => event => {
    const upc = event.target.value;
    if(upc.length <= 12) {
      setCheckoutInput({...checkoutInput, upc})
      if(upc.length === 12) {
        console.log('12')
        
      } 
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
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
          value={checkoutInput.upc}
        />
        <Button onClick={() => console.log('d')}>Add</Button>
      </form>
    </div>
  )
}

export default AddInventory;
