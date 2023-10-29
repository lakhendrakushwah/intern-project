const express = require("express");
const app = express.Router();
const multer = require('multer');
const Snowflake = require("@theinternetfolks/snowflake");
const path = require('path')
var bodyParser = require('body-parser')
const { isAuthenticated } = require('./middleware')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = require("./models");
const { log } = require("console");


app.post('/create', isAuthenticated, async (req, res) => {
    const { name } = req.body
    const owner = req.user.id;
    console.log("user:",req.user);
    try {
        let id = Math.floor(Math.random() * 1000000000);
        let data = {
            id: id,
            name: name,
            slug: name,
            owner: owner
        }
        await db.add_new_form.create(data)
            .then(async (data) => {
                let memberData = {
                    id: Math.floor(Math.random() * 1000000000),
                    role: 985327464,
                    community: id,
                    user: owner
                }
                await db.marketPlace.create(memberData)
                    .then(async (memberData) => {
                        let result =
                        {
                            "status": true,
                            "content": {
                                "data": data
                            }
                        }
                        return res.status(200).send(result)
                    }).catch((err) => {
                        console.log("error 1",err);
                        return res.status(204).send(err)
                    })

            }).catch((err) => {
                console.log("error 2:",err);
                return res.status(204).send(err)
            })
    } catch (error) {
        console.log(error);
        return res.status(201).send(error)
    }
})

app.get("/", async (req, res) => {
    // List all the data with pagination.
    try {
        let community = await db.add_new_form.findAll()
            .catch((err) => {
                console.log("unable to find");
                return res.status(201).send("unable to find")
            })
        return res.status(200).send(community)
    } catch (error) {
        console.log("try catch error:", error);
        return res.status(202).send(`try catch error:${error}`)
    }
})

app.get("/:id/members", async (req, res) => {
    const userId = req.params.id;  // Retrieve the user ID from the URL parameter
    try {
        const member = await db.marketPlace.findAll({
            where: {
                id: userId  // Use the id column to match the user ID
            }
        });
        return res.send(member);
    } catch (error) {
        return res.status(400).json({ message: error.message }); // Using error.message to provide a clearer error message
    }
});


app.get("/me/owner",isAuthenticated, async (req, res) => { //Get My Owned Community
    // List all the data with pagination.
    const userid= req.user.id;
    try {
        const community = await db.add_new_form.findAll({owner : userid})
        return res.send(community);
    } catch (error) {
        return res.status(400).json({message: error})
    }


})
app.get("/me/member",isAuthenticated, async (req, res) => { //Get My Joined Community
    // List all the data with pagination.
    const userid= req.user.id;
    try {
        const member = await db.marketPlace.findAll({
            where: {
                owner: userid,
                role: 60006293
            }
        });
        return res.send(member);
    } catch (error) {
        return res.status(400).json({message: error})
    }

})


module.exports = app;