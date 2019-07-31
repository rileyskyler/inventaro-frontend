const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const http = require('http');
const fs = require('fs');
const cors = require('cors');

const Logger = require('./util/Logger');
const RootResolver = require('./resolvers/root');
const Auth = require('./util/Auth');

dotenv.config();

const init = async () => {

  const app = express();

  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zjanc.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  );

  http.createServer(app).listen(process.env.PORT || 3000, () => {
    Logger.log({level: "info", message: `App listening on port ${process.env.PORT}`});
  });

  main(app);
};

const main = async (app) => {
  
  app.use(cors())
  
  app.use(Auth);

  app.use("/api", graphqlHTTP({
    schema: buildSchema(
      fs.readFileSync('./src/schema.gql', 'utf8')
    ),
    rootValue: RootResolver,
    graphiql: true,
  }));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
};



init();