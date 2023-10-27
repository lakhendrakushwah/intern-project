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


app.post('/signup',async (req,res)=>{
    
    try {
        const {name,email,password} = req.body;
        let id = await Math.floor(Math.random() * 1000000000);;
        let data = {
            id:id,
            name:name,
            email:email,
            password:password
        }
        console.log(data);
        await db.user.create(data)
            .then((data)=>{
                let result = {
                    "status": true,
                    "content": {
                      "data":data,
                      "meta": {
                        "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0"
                      }
                    }
                  }

                return res.status(200).send(result)
            })
            .catch((err)=>{
                return res.status(204).send(err)
            })
    } catch (error) {
        return res.status(201).send(error)
    }

})

app.post("/signin",async(req,res)=>{   // do it by your self  
})

app.get("/me",async(req,res)=>{ // do it by your self or ask to kittu

})

module.exports = app;