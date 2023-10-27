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


app.get('/',async (req,res)=>{
    try {
        await db.forgetPassword.findAll({where:{}})
            .then((data)=>{
                data = JSON.parse(JSON.stringify(data))
                let result = {
                    "status": true,
                    "content": {
                      "meta": {
                        "total": data.length,
                        "pages": 1,
                        "page": 1
                      },
                      "data": data
                    }
                }
                return res.status(200).send(result);
            })
            .catch((err)=>{
                console.log(err);
                return res.status(202).send(err)
            })
    } catch (error) {
        return res.send(error)
    }
})

app.post("/",async(req,res)=>{
    
    try {
        const {name} = req.body;
        let id = await Math.floor(Math.random() * 1000000000);;
        let data = {
            id:id,
            name:req.body.name
        }
        console.log(data);
        await db.forgetPassword.create(data)
            .then((data)=>{
                return res.send(data)
            })
            .catch((err)=>{
                return res.send(err)
            })
    } catch (error) {
        return res.send(error)
    }
})


module.exports = app;