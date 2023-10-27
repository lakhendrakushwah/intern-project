const db = require("../models/index")
const response = require("../utils/responsehandle")
const log = require("../utils/log");
const { error } = require("console");
const { loadavg } = require("os");
const tokenGen = require('../utils/tokenGen');

exports.profileUpdate = async (req, res) => {
    try {
        let requestData = {
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
        }
        await db.user.update(requestData, { where: { email: req.body.email } })
            .then(async (UpdatedData) => {
                let user_data = await db.user.findOne({ where: { email: req.body.email } });
                let details = {
                    username: user_data.userName,
                    firstname: user_data.firstName,
                    lastname: user_data.lastName,
                    email: user_data.email,
                    // admin: user.admin
                };
                let response = {
                    status: 200,
                    msg: "updated Data successfully",
                    data: details
                }
                let token = await tokenGen.getToken(details);
                res.cookie("token", token);
                res.status(200).send(response)
            }).catch(error => {
                log.test(error)
            })
    } catch (error) {
        let response = {
            status: 500,
            msg: " not upadted Data successfully",
            data: error
        }
        console.log(error);
        res.status(500).send(response)
    }
}