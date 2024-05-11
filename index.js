const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/Authroutes");

const app = express();

app.use(cors());
app.use(express.json());

// gnRoqFgFZ8b7Ihpl

mongoose
  .connect(
    "mongodb+srv://rupali:aY8u7tvYMQb5FbAz@cluster0.udficde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    
  )
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", authRoutes);



const server = app.listen(8000, () => console.log(`Server started on 8000`));
