const { gql } = require("apollo-server-express");

const typeDefs = gql`
  #This is the defenition of the user object.
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  #This is the inputData required for the user.
  input UserInputData {
    email: String
    name: String
    password: String
  }

  #This will be use later to Authenticate a user.
  # type AuthData {
  #   token: String!
  #   userId: String!
  # }

  # This contains the methods schemas. Query is use to send get quieries to the database.
  type Query {
    # login(email: String!, password: String!): AuthData!
    getAllUsers: [User]
    getUser(id: ID): User
  }

  # This contains the methods schemas. Mutation is use to mutate or change information of an item in the database. In this case a user.
  type Mutation {
    createUser(userInput: UserInputData!): User!
    deleteUser(id: ID!): String
    updateUser(id: ID!, user: UserInputData): User!
  }
`;

module.exports = { typeDefs };
