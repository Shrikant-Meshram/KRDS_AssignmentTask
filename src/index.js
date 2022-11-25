const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./routes/route")
const app = express();
const passport = require('passport')
const session = require('express-session')
require("./auth/stategies/googleLoginStrategy");
require('dotenv').config()

//********************************************************************** */
// const googlestategies = require('./auth/strategies/googleLoginStrategy');
  
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))

app.use(passport.initialize());
app.use(passport.session());
    
  
  
//************************************************************************ */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://Aditya1998:aadi1998@cluster0.zl7lv.mongodb.net/AssignmentKRDS?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(()=>console.log("MongoDb is Connected"))
.catch(err=>console.log(err))

app.use("/",route)

app.listen((process.env.PORT||3000),function(){
    console.log("Express app running on port "+(process.env.PORT||3000))
} )