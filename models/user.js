//Declaration for mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//This is a schema to create the structure to recive the email, password, name and status for a user.
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!",
  },
});

module.exports = mongoose.model("User", userSchema);
