const express = require("express");
//this allows to server to collect information from the parameters correctly
const bodyParser = require("body-parser");

//I use mongoose to connect to the mongoDB database
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//The express-graphql module provides a simple way to create an Express server that runs a GraphQL API.
const graphqlHttp = require("express-graphql");

//The graphQl schema
const graphqlSchema = require("./graphql/schema");
//The graphQl resolver
const graphqlResolver = require("./graphql/resolvers");
//The middleware used to access the database.
const auth = require("./middleware/auth");

//The URI to connect to the database in mongoDB.
const MONGODB_URI = `mongodb+srv://nico_admin:byu123@cluster0.cukyk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//This runs the express app.
const app = express();

//A configuration for MongoDBStore.
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const PORT = 9000;

//cors allows cross and same origin connections.
const cors = require("cors");

//A configuration for cors that allows the port 3000 to connect to the server.
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const options = {
  family: 4,
};

app.use(bodyParser.json());

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(auth);

//This makes possible to do queries to graphql interface.
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//This connects to the database in mongoDB.
mongoose
  .connect(MONGODB_URI, options)
  .then((result) => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
