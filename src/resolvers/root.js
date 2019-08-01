
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/user');
const Location = require('../models/location');
const Item = require('../models/item');
const Stock = require('../models/stock');

const locationUsers = async (userIds, req) => {
  try {
    return (await User.find({ _id: { $in: userIds } })).map((user) => {
      return {
        ...user._doc, 
        _id: user.id,
        locations: userLocations.bind(this, user._doc.locations)
      }
    })
  }
  catch (err) {
    throw err;
  }
}

const locationInventory = async (inventoryIds, req) => {
  try {
    return (await Stock.find({ _id: { $in: inventoryIds } })).map((stock) => {
      return {
        ...stock._doc, 
        _id: stock.id,
        item: Item.findById(stock._doc.item)
      }
    })
  }
  catch (err) {
    throw err;
  }
}

const userLocations = async (locationIds, req) => {  
  try {
    return (await Location.find({ _id: { $in: locationIds } })).map((location) => {
      return {
        ...location._doc, 
        _id: location.id,
        users: locationUsers.bind(this, location._doc.users),
        inventory: locationInventory.bind(this, location._doc.inventory)
      }
    })
  }
  catch (err) {
    throw err;
  }
}
  
const root = {
  user: async (args, req) => {
    try {
      const user = await User.findById(req.userId);
      return {
        ...user._doc,
        _id: user.id,
        locations: userLocations.bind(
          this,
          (args.locationId) 
            ? args.locationId 
            : user._doc.locations
        )
      }
    }
    catch (err) {
      throw err;
    }
  },
  createItem: async (args) => {
    const itemExists = await Item.findOne({upc: args.itemInput.upc});
    if(itemExists) {
      throw new Error("Item already exists!")
    }
    try {
      const item = await Item({
        upc: args.itemInput.upc,
        title: args.itemInput.title,
        price: args.itemInput.price
      });
      const res = await item.save();
      return {
        ...res._doc,
        _id: res.id
      }
    }
    catch(err) {
      throw err;
    }
  },
  createStock: async (args, req) => {
    console.log(args)
    try {
      const location = await Location.findById(args.createStockInput.locationId);
      if(!location) {
        throw new Error("Location does not exist!");
      }
      else {
        const user = await User.findById('5d3df0df9dd7470bdeaa96da');
        if(!user.locations.includes(location.id)) {
          throw new Error("User does not have permission to edit this location!");
        }
        else {
          const item = await Item.findOne({upc: args.createStockInput.upc});
          if(!item) {
            throw new Error("Item with that UPC does not exist");
          }
          else {
            const stock = new Stock({
              price: args.createStockInput.price,
              quantity: args.createStockInput.quantity,
              item
            });
            const res = await stock.save();
            location.inventory.push(stock);
            await location.save();
            return {
              ...res._doc,
              _id: res.id,
              item: {
                ...item._doc,
                _id: item.id
              }
            }
          }
        }
      }
    }
    catch (err) {
      throw err;
    }
  },
  updateStock: async (args, req) => {
    try {
      const location = await Location.findById(args.UpdateStockInput.locationId);
      if(!location) {
        throw new Error("Location does not exist!");
      }
      else {
        const user = await User.findById('5d3df0df9dd7470bdeaa96da');
        if(!user.locations.includes(location.doc._id)) {
          throw new Error("User does not have permission to edit this location!");
        }
        else {
          const item = await Item.findOne({upc: args.UpdateStockInput.upc});
          if(!item) {
            throw new Error("Item with that UPC does not exist!");
          }
          else {
            const stock = new Stock({
              price: args.UpdateStockInput.price,
              quantity: args.UpdateStockInput.quantity,
              item
            });
            const res = await stock.save();
            location.inventory.push(stock);
            await location.save();
          }
        }
      }
    }
    catch (err) {
      throw err;
    }
  },
  createLocation: async (args, req) => {
    try {
      const locationExists = await User.findOne({title: args.locationInput.title});
      if(locationExists) {
        throw new Error("Location already exists!");
      }
      else {
        const user = await User.findById(req.userId);
        const location = new Location({
          title: args.locationInput.title
        });
        location.users.push(user);
        user.locations.push(location);
        const res = await location.save();
        await user.save();
        return {
          ...res._doc,
          _id: res.id,
          users: locationUsers.bind(this, res.users)
        }
      }
    }
    catch (err) {
      throw err
    }
  },
  createUser: async (args) => {
    try {    
      const userExists = await User.findOne({email: args.userInput.email});
      if(userExists) {
        throw new Error("User already exists!");
      } 
      else {
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          username: args.userInput.username,
          email: args.userInput.email,
          password: hashedPassword
        });
        const res = await user.save();
        return {...res._doc, _id: res.id, password: ''};
      }
    }
    catch (err) {
      throw err;
    }
  },
  login: async (args) => {
    try {
      const userToLogin = await User.findOne({email: args.loginInput.email});
      if(!userToLogin) {
        throw new Error('User not found!');
      }
      else {
        const authenticated = await bcrypt.compare(args.loginInput.password, userToLogin.password)
        if(!authenticated) {
          throw new Error('Password is incorrect!');
        }
        else {
          const token = jwt.sign({userId: userToLogin.id, email: userToLogin.email},
            process.env.AUTH_KEY, {
            expiresIn: '5h'
          })
          return { userId: userToLogin.id, token, tokenExpiration: 5};
        }
      }
    }
    catch (err) {
      throw err;
    }
  },
  getProductInformation: async (args) => {
    try {
      let suggestedPrice = 0.00;
      let titleSuggestions = [];
      let brandSuggestions = [];
      const { data } = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${args.upc}`);
      if(data.code !== 'OK') {
        throw new Error('Failed to find product information.');
      }
      else if (data.code === 'OK') {
        data.items.forEach(item => {
          if(!brandSuggestions.includes(item.brand)) {
            brandSuggestions.push(item.brand);
          }
          if(item.offers) {
            suggestedPrice = (item.offers.reduce((accumulator, offer) => {
              if(!titleSuggestions.includes(offer.title)) {
                titleSuggestions.push(offer.title);
              }
              return accumulator + offer.price;
            }, 0) / item.offers.length);
          }
          else if(item.lowest_recorded_price && item.highest_recorded_price) {
            suggestedPrice = (item.lowest_recorded_price  + item.highest_recorded_price) / 2;
          }
        })
      }
      return {titleSuggestions, brandSuggestions, suggestedPrice: suggestedPrice.toFixed(2)};
    }
    catch (err) {
      console.log(err);
    }
  }
};

module.exports = root;