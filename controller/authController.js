const db = require("../models/index")
const tokenGen = require('../utils/tokenGen');
const bcrypt = require('bcrypt');
var crypto = require("crypto");
const response = require("../utils/responsehandle")
const nodemailer = require("../utils/nodemailer")
const log = require("../utils/log");
const { regenerateToken } = require('./zohoAuth')
const { error } = require("console");
const axios = require('axios');
db.sequelize.sync();

exports.home = async (req, res) => {
    log.test("home called", "")
    res.send('hello Home route');
}

exports.register = async (req, res) => {
    var password = req.body.password;
    const email = req.body.email
    var uname = crypto.randomBytes(20).toString('hex')
    password = password.toString();
    const saltRounds = 15;
    const hash = bcrypt.hashSync(password, saltRounds);
    // let dataaa = await db.User.findAll({ where: {} })
    //     .then(data1 => {
    //          log.dev('data1 ', data1);
    //     })
    //     .catch(console.error())
    const user = await db.User.findOne({ where: { email: email } })

    if (!user) {
        var data = {
            userName: uname,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: hash
        }
        console.log(data);
        try {
            await db.User.create(data)
                .then(async (userData) => {
                    userData = JSON.parse(JSON.stringify(userData))
                    var forgetToken = crypto.randomBytes(20).toString('hex');
                    var f = {
                        userId: userData.id,
                        email: userData.email,
                        token: forgetToken,
                        verified: 0
                    }
                    log.dev('f==>', f);
                    // return response.throw(200, "verification email has been sent to your email id", "hello", res)
                    // return res.status(200).send({"ok":"dfsdfds"})
                    try {
                        // log.dev('forgetPassword:', db.forgetPassword);
                        db.forgetPassword.create(f)
                            .then(async (fData) => {
                                fData = JSON.parse(JSON.stringify(fData))
                                // log.dev('fData:', fData);
                                const link = process.env.React_ORIGIN + "/verify-account/" + userData.userName + "/"
                                const Data = {
                                    email: email,
                                    link: link
                                }
                                try {
                                    await nodemailer.transporter(Data)
                                        .then(async () => {
                                            log.dev("verification email has been sent to your email id");
                                            await db.User.findOne({ where: { email: email } })
                                                .then(async (u) => {
                                                    let details = {
                                                        username: u.userName,
                                                        firstname: u.firstName,
                                                        lastname: u.lastName,
                                                        email: u.email,
                                                        role: u.role,
                                                        test: 'from register',
                                                        emailverified:u.email_verified
                                                    };

                                                    let token = await tokenGen.getToken(details);
                                                    res.cookie("token", token);
                                                    return response.throw(200, "verification email has been sent to your email id", data, res)
                                                })
                                                .catch((err) => {
                                                    console.log("erererere:", err);
                                                    return res.status(203).send('problem while adding')
                                                })

                                        })
                                } catch (error) {
                                    log.dev(error);
                                    return response.throw(202, "Something went please try again!", error, res)
                                }
                            })
                            .catch((err) => {
                                log.dev("errrrrrrr:", err);
                            })
                    }
                    catch (err) {
                        log.dev('eeeeerrr:', err);
                    }

                })
                .catch((error) => {
                    log.dev("somwthing went wrong with user.create", error)
                    return response.throw(202, "Something went please try again!", error, res)
                })
        } catch (error) {
            log.dev(error);
            // return res.status(202).send("Something went please try again!!!")
            return response.throw(202, "Something went please try again!", error, res)
        }
    } else {
        log.dev("user already exist");
        // return res.status(201).send(response);
        // return res.status(201).send("user already exist")
        return response.throw(201, "user already exist", "", res)
    }
}

exports.login = async (req, res) => {
    let body = req.body;
    // log.dev(body);
    var { password, email } = req.body
    // log.dev('emai:', email, "pass:", password);
    try {
        var user = await db.User.findOne({ where: { email: email } }).catch((err)=>{
            console.log(err)
        })
        if (user === null) {
            log.dev('User Not found!', '')
            // return res.send("user Not Found")
            return response.throw(201, "User Not found!", "", res)
        } 
        else {
            const match = bcrypt.compareSync(password, user.password);
            if (match) {
                    let details = {
                        username: user.userName,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        email: user.email,
                        role: user.role,
                        emailverified:user.email_verified,
                        contactId: user.contactId
                    };
                    let token = await tokenGen.getToken(details);
                    res.cookie("token", token);
                    if (!user.contactId) {
                        const access_token = await regenerateToken();
                        await axios({
                            'method': 'POST',
                            'url': `https://desk.zoho.in/api/v1/contacts`,
                            'headers': {
                                'orgId': '60022959159',
                                "Authorization": `Zoho-oauthtoken ${access_token}`
                            },
                            'data': {
                                "lastName": user.lastName,
                                "firstName": user.firstName,
                                "email": user.email
                            }
                        }).then(async (resp) => {
                            await db.User.update({contactId: resp.data.id}, {
                                where: {
                                    email: user.email
                                }
                            }).then((x) => {
                            }).catch((err) => {
                                console.log(err);
                            })
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                    // return res.send("Logged In Successfully")
                    return response.throw(200, "Logged In Successfully", details, res)
            } else {
                log.dev('Wrong Password!', '');
                // return res.send("Wrong Password!")
                return response.throw(201, "Wrong Password!", "", res)
            }
        }
    } catch (error) {
        log.dev("something went wrong with login", error)
        // return res.send("something went wrong Please try again!")
        return response.throw(201, "something went wrong Please try again!", "", res)
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token")
        log.dev("logged out", '');
        response.throw(200, "logged out", "", res)
    } catch (error) {
        log.test('something went wrong with logout', '')
        response.throw(202, "something went wrong please try again!", "", res)
    }
}

exports.verify = async (req, res) => {
    const username = req.params.username;
    // console.log(username);
    try {
        const user = await db.User.findOne({
            where: { userName: username },
        })
            .then(async(user) => {
                if (user) {
                    user = JSON.parse(JSON.stringify(user))
                    await db.User.update({ email_verified: "1" },{ where: { userName: user.userName } })
                    .then(async()=>{
                            log.dev("account verified", "");
                            response.throw(200, "account verified", "", res);
                        })
                    .catch((err)=>{
                        console.log("hg----------hh0--",err);
                        })
                } else {
                    log.dev("wrong verification email link", "");
                    response.throw(201, "wrong verification email link", "", res);
                }
            })
    } catch (error) {
        log.test("someting wrong with email verifification", error);
        response.throw(202, "someting wrong verification email link", "", res);

    }
};

exports.resendVerifyEmail = async (req, res) => {
    console.log(req.body.email);
    try {
        const email = req.body.email;
        var user = await db.User.findOne({ where: { email: email } });
        user = JSON.parse(JSON.stringify(user))
        if (!user) {
            log.test("User Not found!", "");
            return response.throw(201, "User Not found!", "", res);
        }
        else if(!user.email_verified){
            return response.throw(200, "Your account already verified !!", "", res);
        }
        else {
            const link = process.env.React_ORIGIN + "/verify-account/" + user.userName + "/"
            const Data = {
                email: email,
                link: link
            }
            try {
                await nodemailer.transporter(Data)
                    .then(async () => {
                        log.dev("verification email has been sent to your email id");
                        return response.throw(200, "verification email has been sent to your email id", Data, res)
                    })
            } catch (error) {
                log.dev(error);
                return response.throw(202, "Something went wrong please try again!", error, res)
            }
        }
    } catch (error) {
        log.test("something wrong with verifyaccount", error);
    }
};

exports.updatePassword = async (req, res) => {
    const email = req.user.email
    try {
        var user = await db.user.findOne({ where: { email: email } })
        if (!user) {
            console.log("something went wrong");
            let responce = {
                status: 201,
                msg: "Something went wrong!",
                data: ""
            }
            return res.status(201).send(responce);
        }
        var password = req.body.password;
        const saltRounds = 15;
        const hash = bcrypt.hashSync(password, saltRounds);
        await db.user.update({
            password: hash
        },
            {
                where: { email: email }
            })
            .then(async () => {
                console.log("password updated successfully");
                let responce = {
                    status: 200,
                    msg: "password updated successfully",
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                }
                return res.status(200).send(responce);
            })
    } catch (error) {
        log.dev('errorrrr:::', error)
        return response.throw(501, "failed to update password", error, res)
    }
};

exports.profile = async (req, res) => {
    log.dev("req.user:", req.user);
    let data = req.user;
    data = JSON.parse(JSON.stringify(data))
    return response.throw(200, "Your Profile is", data, res);
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

        // Generate a reset token
        const forgetToken = crypto.randomBytes(20).toString('hex');
        await db.forgetPassword.create({ userId: user.id, email: email, token: forgetToken, verified: '0' });

        // Create a URL for password reset
        const resetUrl = process.env.React_ORIGIN + "/reset-password/" + forgetToken + "/";

        // Send the password reset email
        const Data = {
            email: email,
            link: resetUrl
        }
        try {
            await nodemailer.transporterForResetPass(Data)
                .then(async () => {
                    log.dev("Password reset link has been sent to your email id");
                    return response.throw(200, "Password reset link has been sent to your email id", user, res)
                })
        } catch (error) {
            log.dev(error);
            return response.throw(202, "Something went please try again!", error, res)

        }
    } catch (error) {
        console.error('Error initiating password reset:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

exports.resetPasswordRedirect = async (req, res) => {
    let forgotToken = req.params;
    //console.log(forgotToken);
    await db.forgetPassword
      .findOne({ where: { token : forgotToken.forgotToken } })
      .then(async (data) => {
        if (!data || data.verified=="1") {
          log.dev("Wrong password reset link!", "");
          return response.throw(
            201,
            "this link has been expired or wrong!",
            "",
            res
          );
        } else {
          response.throw(200, "link verified", "", res);
        }
      })
      .catch((err) => {
        log.test("something wrong with reset_verify-- ", err);
        response.throw(201, "something went wrong please try again!", "", res);
      });
}

function validatePW(str) {
    if (str.length <= 5) {
      return false;
    }
  
    if (!/[A-Z]/.test(str)) {
      return false;
    }
    if (!/[a-z]/.test(str)) {
      return false;
    }
    return true;
  }

exports.resetPassword = async (req, res) => {
    let forgotToken = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    //console.log(password);
    if(password!=confirmPassword) {
        return response.throw(
            202,
            "Passwords do not match!",
            "",
            res
          );
    }
    const saltRounds = 15;
    const forgot = await db.forgetPassword.findOne({ where: { token: forgotToken } })
      .then(async (data) => {
        const user = await db.User.findOne({ where: { email: data.email } });
        //console.log(user);
  
        if (!user) {
          return response.throw(201, "Please check password reset link", "", res);
        } else if (validatePW(password) === true) {
          const hash = bcrypt.hashSync(password, saltRounds);
          console.log(hash)
          await db.User.update({ password: hash }, { where: { email: data.email } })
            .then(async (data) => {
  
              await db.forgetPassword
                .update(
                  { verified: "1" },
                  { where: { token: forgotToken } }
                )
                //console.log("done")
                .then(async () => {
                    //console.log("done");
                  return response.throw(
                    200,
                    "Password reset successfully!",
                    "",
                    res
                  );
                })
                .catch((err) => {
                  log.test("Some Thing went wrong please try again", err);
                  return response.throw(
                    201,
                    "Some Thing went wrong please try again",
                    err,
                    res
                  );
                });
            })
            .catch(() => {
              log.dev("Some Thing went wrong please try again", "");
              return response.throw(
                201,
                "Some Thing went wrong please try again",
                "",
                res
              );
            });
        } else {
          return response.throw(
            500,
            "Invalid: Password doesn't meet the requirements",
            "",
            res
          );
        }
      })
      .catch((err) => {
        log.test("something wrong with reset_password", err);
        return response.throw(
          201,
          "Some Thing went wrong please try again",
          "",
          res
        );
      });
  }