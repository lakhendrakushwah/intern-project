const express = require("express");
const app = express.Router();
const multer = require('multer');
const Snowflake = require( "@theinternetfolks/snowflake");
const path = require('path')
var bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = require("./models");
const { log } = require("console");


app.post('/',async (req,res)=>{
    // Create a community from the given data.
})

app.get("/",async(req,res)=>{ 
    // List all the data with pagination.
})

app.get("/:id/members",async(req,res)=>{
    // List all the data with pagination.

})

app.get("/me/owner",async(req,res)=>{ //Get My Owned Community
    // List all the data with pagination.
})
app.get("/me/member",async(req,res)=>{ //Get My Joined Community
    // List all the data with pagination.
})


module.exports = app;