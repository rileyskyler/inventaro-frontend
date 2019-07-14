const express = require('express');
const mongoose = require('mongoose');
const winston = require("winston");
const dotenv = require('dotenv');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const http = require('http');
const fs = require('fs');
const bcrypt = require('bcrypt');

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
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    locations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location'
      }
    ]
  });
  const User = mongoose.model("User", userSchema);

  const itemSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Int
    }
  });

  const locationSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    inventory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
      }
    ]
  });

  const locationSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    inventory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
      }
    ]
  });

  const stockSchema = new Schema({
    quantity: {
      type: Number,
      required: true
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item'
    }
  });

  const Item = mongoose.model("Item", itemSchema);
  const User = mongoose.model("User", userSchema);
  const Location = mongoose.model("Location", locationSchema);
  const Stock = mongoose.model("Stock", stockSchema);


  app.use((req, res, next) => {
    console.log('middlewear')
    return next();
  })
  
  app.use("/api", graphqlHTTP({
    schema: buildSchema(
      fs.readFileSync('./src/schema.graphql', 'utf8')
    ),
    rootValue: {


    
      users: async () => {
        try {
          return (await User.find()).map((user) => {
            return {
              ...user._doc,
              _id: user.id
            };
          });
        }
        catch (err) {
          throw err;
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
          throw err
        }
      },

      login: async (args) => {
        
        try {
            
          const userToLogin = await User.findOne({email: args.loginInput.email})
            
          if(!userToLogin) {
              throw new Error('User not found!')
          }
          else {
              
            const authenticated = await bcrypt.compare(args.loginInput.password, userToLogin.password)
            if(!authenticated) {
              throw new Error('Password is incorrect!')
            }
            else {
              const token = jwt.sign({userId: userToLogin.id, email: userToLogin.email}, process.env.AUTH_KEY, {
                  expiresIn: '1h'
              })
              return { userId: userToLogin.id, token, tokenExpiration: 1}
            }
          }
        }
        catch (err) {
            throw err
        }
    }
  },
    graphiql: true,
  }));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

};

init();