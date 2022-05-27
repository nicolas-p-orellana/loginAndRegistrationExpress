// bcrypt encripts the user's password
const bcrypt = require("bcryptjs");
//This helps validate names and password.
const validator = require("validator");
//jwt is use to create a token for the user to login with.
const jwt = require("jsonwebtoken");
//Imports the model for the users.
const User = require("../models/user");

const resolvers = {
  Query: {
    //This method gets all the users in the database.
    getAllUsers: async () => {
      const users = await User.find();
      return users;
    },

    //This method gets a user by its id in the database.
    async getUser(_, { id }) {
      const user = await User.findById(id);
      return { ...user._doc, _id: user._id.toString() };
    },
    // //This function will be use to log in from the frontend.
    // login: async function (_, { email, password }) {
    //   const user = await User.findOne({ email: email });
    //   if (!user) {
    //     const error = new Error("User not found.");
    //     error.code = 401;
    //     throw error;
    //   }
    //   const isEqual = await bcrypt.compare(password, user.password);
    //   if (!isEqual) {
    //     const error = new Error("Password is incorrect.");
    //     error.code = 401;
    //     throw error;
    //   }
    //   const token = jwt.sign(
    //     {
    //       userId: user._id.toString(),
    //       email: user.email,
    //     },
    //     "somesupersecretsecret",
    //     { expiresIn: "1h" }
    //   );

    //   return { token: token, userId: user._id.toString() };
    // },
  },

  Mutation: {
    //This method creates a user, also validates the email and the password.
    createUser: async function (_, args) {
      const { email, name, password } = args.userInput;

      const errors = [];
      if (!validator.isEmail(email)) {
        errors.push({ message: "E-Mail is invalid." });
      }
      if (
        validator.isEmpty(password) ||
        !validator.isLength(password, { min: 5 })
      ) {
        errors.push({ message: "Password too short!" });
      }
      if (errors.length > 0) {
        const error = new Error("Invalid input.");
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        const error = new Error("User exists already!");
        throw error;
      }

      // I use bcrypt to encrypt the password.
      const hashedPw = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        name,
        password: hashedPw,
      });
      const createdUser = await user.save();
      return { ...createdUser._doc, _id: createdUser._id.toString() };
    },

    //This method deletes a user by its id.
    async deleteUser(_, { id }) {
      await User.findByIdAndDelete(id);
      return "User deleted";
    },

    //This method updates a user by its id.
    async updateUser(_, { user, id }) {
      const userUpdated = await User.findByIdAndUpdate(
        id,
        { $set: user },
        { new: true }
      );
      return userUpdated;
    },
  },
};

module.exports = { resolvers };
