const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const db = require('../models/index');
const response = require('../utils/responsehandle');
const log = require('../utils/log')


db.sequelize.sync();
const users = db.USERS;


exports.isAuthenticated = (req, res, next) => {

    const cookie = req.headers.cookie;
    if (!cookie) {
        console.log('Please sign in to continue');
        let response = {
            status: 201,
            msg: "Please sign in to continue",
            data: ""
        }
        return res.status(201).send(response);
        // return res.render('login', {
        //     message: 'Please sign in to continue'
        // })
    }
    // if (cookie == null) return res.sendStatus(401)

    //extract the token from the authorization header
    let splited_cookie = cookie.split('token=')
    let token = splited_cookie[1]


    jwt.verify(token, process.env.JWT_AUTH_KEY, async (err, user) => {
        if (err) {
            log.test("Session expired, please login to continue", err);
            res.clearCookie("token");
            return response.throw(202, "Session expired, please login to continue", '', res)
        }
        await db.User.findOne({
            where: {
                email: user.email
            }
        }).then(async (u) => {
            u = JSON.parse(JSON.stringify(u));
            req.user = u;
            next();
            return;
        })
    });
}
exports.isAdmin = async (req, res, next) => {
    const email = req.user.email
    const user = await db.User.findOne({ where: { email: email } })
        .then(async (user) => {
            if (user.role == "admin") {
                next()
            } else {
                return response.throw(202, "You donn't have admin permissions!", '', res)
            }
        })
}
