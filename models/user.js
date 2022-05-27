//This is a schema to create the structure to recive the email, password, name and status for a user.
const { Schema, model } = require("mongoose");

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
});

//Declaration for mongoose
module.exports = model("User", userSchema);
