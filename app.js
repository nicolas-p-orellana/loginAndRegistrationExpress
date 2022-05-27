//I use dotenv to access credentials to connect to the port and database.
require("dotenv").config();

//I use Express as the backend framework.
const express = require("express");

//I use ApolloServer to connect to the express server using graphql.
const { ApolloServer } = require("apollo-server-express");

//This are the typeDefs of Apollo similar to schemas.
const { typeDefs } = require("./apollo-graphql/typeDefs");

//The resolvers are the method use to make the queries.
const { resolvers } = require("./apollo-graphql/resolvers");

//I connect to the database en mongoDB using mongoose.
const { connectDB } = require("./db");

const app = express();
connectDB();

app.get("/", (req, res) => res.send(" Welcome to my api "));

module.exports = app;

// A basic function to start ApolloServer
async function start() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.use("*", (req, res) => res.status(404).send(" Not found "));

  app.listen(process.env.PORT, () => {
    console.log("Runing");
  });
}

start();
