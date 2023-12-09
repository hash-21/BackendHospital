const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      const conn = await mongoose.connect(process.env.MONGODB_URL);

      console.log("DB Connection Established");
   } catch (error) {
    console.log("Issue in DB Connection");
      console.log(error);
      process.exit(1);
   }
};
module.exports = connectDB;
