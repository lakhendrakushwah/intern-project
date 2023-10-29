const express = require("express");
const app = express.Router();
const multer = require('multer');
const Snowflake = require( "@theinternetfolks/snowflake");
const path = require('path')
var bodyParser = require('body-parser')
const {isAuthenticated} = require('./middleware')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = require("./models");
const { log } = require("console");


app.post('/',isAuthenticated, async (req,res)=>{
    // A user when added to a community and assigned a role in it, is called a member.
    const {community, user, role} = req.body
    try {
        let id = await Math.floor(Math.random() * 1000000000);
        let data = {
            id: id,
            community: community,
            user: user,
            role: role
        }
        await db.marketPlace.create(data)
                    .then(async (data) => {
                        let result =
                        {
                            "status": true,
                            "content": {
                                "data": data
                            }
                        }
                        return res.status(200).send(result)
                    }).catch((err) => {
                        return res.status(204).send(err)
                    })

    } catch (error) {
        return res.status(201).send(error)
    }
})

app.delete("/:id", isAuthenticated, async (req, res) => {
    const idToDelete = req.params.id;
    try {
        await db.marketPlace.destroy({
            where: {
                id: idToDelete
            }
        });
        return res.json({message: 'Deleted successfully.'});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
});

module.exports = app;