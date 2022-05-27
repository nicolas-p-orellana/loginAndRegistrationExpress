const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connectDB };
