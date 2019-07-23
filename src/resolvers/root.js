
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const Stock = require('../models/stock');
const Item = require('../models/item');
const Location = require('../models/location');

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
  
  createLocation: async (args, req) => {
    
    
    try {
      
      const locationExists = await User.findOne({name: args.locationInput.name});
      
      if(locationExists) {
        throw new Error('User already exists!');
      }
      
      else {

        console.log(req.userId);
        const user =  await User.findById(req.userId);
        
        const location = new Location({
          name: args.locationInput.name
        });

        location.users.push(user);
        user.locations.push(location);

        const locationRes = await location.save();
        await user.save();

        return {
          ...locationRes._doc,
          _id: locationRes.id,
          users: locationUsers.bind(this, locationRes.users)
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
        throw new Error('User already exists!');
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
          return { userId: userToLogin.id, token, tokenExpiration: 1};
        }
      }
    }
    catch (err) {
      throw err;
    }
  }

};
  

module.exports = root;