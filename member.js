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
    // A user when added to a community and assigned a role in it, is called a member.
})

app.delete("/:id",async(req,res)=>{ // Remove member
})


module.exports = app;