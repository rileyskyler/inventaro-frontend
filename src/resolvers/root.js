
const RootResolver = {
    
  createUser(args) {
      
    try {
            
      const userExists = await User.findOne({email: args.userInput.email})
            
      if(!userExists) {
        throw new Error('User already exists!')
      } else {

        const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

        const user = new User({
          username: args.userInput.username,
          email: args.userInput.email,
          password: hashedPassword
        })

        const res = await user.save()

        return {...res._doc, _id: res.id, password: ''}
      }
    }
    catch (err) {
      throw err
    }
  },

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
  
  userLocations = async (locationIds, req) => {
          
    try {
      return (await Location.find({ _id: { $in: deviceIds } })).map((location) => {
        return {
          ...device._doc, 
          _id: device.id,
          locations: this.methods.locations.bind(this, device._doc.locations)
        }
      })
    }
    catch (err) {
      throw err
    }
  }

  }  


    

}

module.exports = RootResolver;