
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/user');
const Location = require('../models/location');
const Item = require('../models/item')

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

const userLocations = async (locationIds, req) => {  
  try {
    return (await Location.find({ _id: { $in: locationIds } })).map((location) => {
      return {
        ...location._doc, 
        _id: location.id,
        users: locationUsers.bind(this, location._doc.users)
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
  createStock: async ( args, req) => {
    try {
      const item = await Item({
        
      });
    }
    catch(err) {
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
        const user =  await User.findById(req.userId);
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