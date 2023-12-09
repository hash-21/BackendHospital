const express = require("express");
const app = express();
const dotenv = require("dotenv");
const doctor=require("./routes/doctorRoute");
const patient=require("./routes/patientRoute");
const report= require("./routes/reportRoute");

const cors = require("cors");
const connectDB = require("./config/database");
dotenv.config();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/doctors",doctor );
app.use("/patients", patient);
app.use("/reports",report);

const port = process.env.PORT || 4000; 

app.listen(port, (error) => {
   if (error) {
      console.log("error in the port");
   }
   console.log(`server is running on the port ${port} `);
});

