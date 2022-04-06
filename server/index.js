const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{
         useNewUrlParser: true,
         useUnifiedtopology: true,
    }).then(() =>{
        crossOriginIsolated.log("DB connection secceeed");
    })
    .catch((err) =>{
        console.log(err.message);
    });

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`)
});