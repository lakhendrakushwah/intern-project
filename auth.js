const express = require("express");
const app = express.Router();
const multer = require('multer');
const Snowflake = require( "@theinternetfolks/snowflake");
const path = require('path')
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = require("./models");
const { log } = require("console");
let getToken = async (details) => {
    return jwt.sign(
        details,
        process.env.JWT_AUTH_KEY,
        {
            expiresIn: '60m'
        })
}

app.post('/signup',async (req,res)=>{
    
    try {
        let {name,email,password} = req.body;
        // var uname = crypto.randomBytes(20).toString('hex')
        // password = password.toString();
        const saltRounds = 15;
        const hash = bcrypt.hashSync(password, saltRounds);
    
        let id = await Math.floor(Math.random() * 1000000000);;
        let data = {
            id:id,
            name:name,
            email:email,
            password:hash
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
                console.log(err);
                return res.status(204).send(err)
            })
    } catch (error) {
        console.log("error",error);
        return res.status(201).send(error)
    }

})

app.post("/signin",async(req,res)=>{   

    try{
        const {email, password} = req.body;
        var user = await db.user.findOne({ where: { email: email } }).catch((err)=>{
            console.log(err)
        })
        if (!user) {
            console.log('User Not found!', '')
            return res.status(201).send("user not found")
        }
        else {
            console.log("user:",JSON.parse(JSON.stringify(user)));
            let match = await bcrypt.compareSync(password, user.password);
            if (match) {
                    let details = {
                        id:user.id,
                        username: user.userName,
                        email: user.email
                    };
                    let token = await getToken(details);
                    res.cookie("token", token);
                    return res.status(200).send("Logged In Successfully")
            } else {
                console.log('Wrong Password!', '');
                return res.send("Wrong Password!")
            }
        }
    } 
    catch(error){
        console.log(error);
        return res.status(201).send(error);
    }
})

app.get("/me",async(req,res)=>{ // do it by your self or ask to kittu

})

module.exports = app;