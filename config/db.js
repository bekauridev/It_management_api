const mongoose = require("mongoose");
// connect to mongoose DB
const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Mongo Db connected : ${connection.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
