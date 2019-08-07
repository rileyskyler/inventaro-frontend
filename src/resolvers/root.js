
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
        locations: userLocations.bind(this, user._doc.locations)
      }
    }
    catch (err) {
      throw err;
    }
  },
  location: async (args, req) => {
    try {
      const location = await Location.findById(args.id);
      if(!location) {
        throw new Error("Location with that id does not exist!");
      }
      else {
        if(!location.users.includes(req.userId)) {
          throw new Error("User does not have permission to access this location!")
        }
        else {
          return {
            ...location._doc,
            _id: location.id,
            inventory: locationInventory.bind(this, location._doc.inventory)
          }
        }
      }
    }
    catch (err) {
      throw err;
    }
  },
  item: async (args, req) => {
    try {
      const item = await Item.findOne({upc: args.upc});
      if(!item) {
        throw new Error("Item does not exist!")
      }
      else {
        return {
          ...item._doc,
          id: item.id
        }
      }
    }
    catch (err) {
      throw err;
    }
  },
  createItem: async (args) => {
    try {
      const itemExists = await Item.findOne({upc: args.itemInput.upc});
      if(itemExists) {
        console.log('itemExists')
        throw new Error("Item already exists!")
      }
      else {
        const item = Item({
          brand: args.itemInput.brand,
          upc: args.itemInput.upc,
          title: args.itemInput.title,
        });
        const res = await item.save();
        return {
          ...res._doc,
          _id: res.id
        }
      }
    }
    catch(err) {
      throw err;
    }
  },
  createStock: async (args, req) => {
    try {
      const location = await Location.findById(args.stockInput.locationId);
      if(!location) {
        throw new Error("Location does not exist!");
      }
      else {
        const user = await User.findById(req.userId);
        if(!user.locations.includes(location.id)) {
          throw new Error("User does not have permission to edit this location!");
        }
        else {
          const item = await Item.findOne({upc: args.stockInput.upc});
          if(!item) {
            throw new Error("Item with that UPC does not exist");
          }
          else {
            const stock = new Stock({
              price: args.stockInput.price,
              quantity: args.stockInput.quantity,
              item,
              location
            });
            const res = await stock.save();

            location.inventory.push(stock);
            await location.save();
            return {
              ...res._doc,
              _id: res.id,
              location: {
                ...item._doc,
                _id: item.id
              },
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
      const stock = await Stock.findById(args.updateStockInput.stockId);
      console.log(stock)
      if(!stock) {
        throw new Error("Stock does not exist!");
      }
      else {
        const location = await Location.findById(stock.location);

        if(!location.users.includes(req.userId)) {
          throw new Error("User does not have permission to edit this stock!");
        }
        else {
          const item = await Item.findById(stock.item);
          console.log('item')
          stock.price = args.updateStockInput.price;
          stock.quantity = args.updateStockInput.quantity;
          
          // console.log(stock)
          const res = await stock.save()
          console.log('res',res)
          return {
            price: stock.price,
            quantity: stock.quantity,
            item
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
            expiresIn: '72h'
          })
          return { userId: userToLogin.id, token, tokenExpiration: 72};
        }
      }
    }
    catch (err) {
      throw err;
    }
  },
  productSuggestions: async (args) => {
    try {
      let priceSuggestions = [];
      let titleSuggestions = [];
      let brandSuggestions = [];
      const { data } = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${args.upc}`);
      if(data.code !== 'OK') {
        throw new Error('Failed to find product information.');
      }
      else if (data.code === 'OK') {
        data.items.forEach(item => {
          brandSuggestions = [ ...new Set([ ...brandSuggestions, item.brand ]) ];
          titleSuggestions = [ ...new Set([
            ...titleSuggestions, item.title,
            ...(item.offers || []).map(({ title }) =>  title)
          ])];
          priceSuggestions = [ ...new Set([
              ...priceSuggestions,
              ...[((item.offers || []).reduce((acc, { price }) => acc + price, 0) / (item.offers.length || 1)).toFixed(2)].filter(p => p > 0),
              ((item.lowest_recorded_price  + item.highest_recorded_price) / 2).toFixed(2)
          ])]
        })
      }
      return {
        titleSuggestions,
        brandSuggestions,
        priceSuggestions
      };
    }
    catch (err) {
      throw err;
    }
  }
};

module.exports = root;