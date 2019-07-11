const express = require('express');
const mongoose = require('mongoose');
const winston = require("winston");
const dotenv = require('dotenv');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const http = require('http');
const fs = require('fs')

dotenv.config();
const Schema = mongoose.Schema;

const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
      ),
      transports: [new winston.transports.Console()]
    });
    
const init = () => {
      
  const app = express();

  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zjanc.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  );

  http.createServer(app).listen(process.env.PORT || 3000, () => {
    logger.log({level: "info", message: `App listening on port ${process.env.PORT}`});
  });

  main(app);
};

const main = async (app) => {

  const userSchema = new Schema({
    name: String
  });

  const User = mongoose.model("User", userSchema);


  
  app.use((req, res, next) => {
    console.log('middlewear')
    return next();
  })
  
  app.use("/api", graphqlHTTP({
    schema: buildSchema(
      fs.readFileSync('./src/schema.graphql', 'utf8')
    ),
    rootValue: {

    createUser: async ({userInput}) => {
      let user;
      try {
        user = new User({name: userInput.name});
      }
      catch (err) {
        throw err;
      }
      user.save();
      return {...user._doc, _id: user.id};
    },
    
    
    users: async () => {
      try {
        return (await User.find()).map((user) => {
          return {
            ...user._doc,
            _id: user.id,
            locations: 
          };
        });
      }
      catch (err) {
        throw err;
      }
      const userLocations = async (locationIds) => {
        
      }
      test();
    },

    user: async (args, req) => {
      
      try {
        const user = await User.findById(req.userId);
        return {
          ...user._doc,
          _id: user.id
          
        }
      }
      catch (err) {
        throw err
      }
    },

    userLocations: async (locationIds) => {
                
      this.conf.logger.info(`[Registry] Locations`);
      
      try {
          return (await Location.find({ _id: {$in: locationIds} })).map((location) => {
              return {
                  ...location._doc,
                  _id: location.id
              }
          })
      }
      catch (err) {
          throw err
      }
  },
  },
    graphiql: true,
  }));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

};

init();