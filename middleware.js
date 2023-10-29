const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const db = require('./models/index');

db.sequelize.sync();
const users = db.USERS;


exports.isAuthenticated = (req, res, next) => {

    const cookie = req.headers.cookie;
    console.log("cookies:",cookie);
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
    let tokenF = splited_cookie[1]
    let splited_cookie2 = tokenF.split(';')
    console.log("token aa",splited_cookie2);
    let token = splited_cookie2[0]
    console.log("token:",token);



    jwt.verify(token,process.env.JWT_AUTH_KEY, (err, user) => {
        if (err) {
            console.log("Session expired, please login to continue",err);
            res.clearCookie("token");
            return res.status(201).send("Session expired, please login to continue")
        }
        req.user = user
        next()
    });
}
exports.isAdmin = async (req, res, next) => {
    const id = req.user.id
    const user = await db.marketPlace.findOne({ where: { id: id } })
        .then(async (user) => {
            if (user.role == "985327464") {
                next()
            } else {
                return response.throw(202,"You donn't have admin permissions!",'',res)
            }
        })
}