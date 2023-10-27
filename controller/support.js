const db = require("../models/index")
const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer')
const response = require("../utils/responsehandle")
const log = require("../utils/log");
const { error } = require("console");

var sendsupportMail = async (user_data, support_data) => {
    let name = user_data.firstName
    let description = support_data.description
    let subject = support_data.subject
    let requestEmail = user_data.email
    let secure;
    if (process.env.MAIL_PORT == 465) {
        secure = true;
    } else secure = false;
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: secure, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASS, // generated ethereal password
            },
        });
        // send mail with defined transport object
        let info = transporter.sendMail({
            from: `"Easenode " "${process.env.MAIL_FROM}" `, // sender address
            to: [process.env.MAIL_FROM], // list of receivers
            subject: ` support mail`, // Subject line
            // text: "we will connect you soon !", // plain text body
            // html: URL, // html body
            html: `<!DOCTYPE html><html><head> <title>Easenode - Customer Support</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 5px; } h1 { color: #333333; margin-top: 0; } p { color: #555555; line-height: 1.5; } .signature { margin-top: 30px; font-size: 14px; color: #777777; } </style></head><body> <div class="container"> <h1>From ${name} Email : ${requestEmail}</h1> <ul> <li><strong>User:</strong> ${name}</li> <li><strong>UserEmail:</strong>${requestEmail}</li> <li><strong>Subject :</strong>${subject}</li><li><strong>Description:</strong> ${description}</li></ul> </div></body></html>`
        })
        if (info) {
            let response = {
                status: 200,
                msg: "sent mail successfully",
                data: info
            }
            return response
        }
    } catch (error) {
        log.dev("error", error)
        let response = {
            status: 500,
            msg: "sent mail not successfully",
            data: ""
        }
        return response
    }
}

exports.support = async (req, res) => {
    await db.user.findOne({ where: { email: req.user.email } })
        .then(async (user_data) => {
            try {
                let support_data = {
                    userid: user_data.id,
                    subject: req.body.subject,
                    description: req.body.description,
                }
                await db.support.create(support_data).then(async (UodatedData) => {
                    await sendsupportMail(user_data, support_data).then((sent_d) => {
                        let response = {
                            status: 200,
                            msg: "support ticket sent successfully",
                            data: user_data
                        }
                        res.status(200).send(response)

                    }).catch((err) => {
                        let response = {
                            status: 500,
                            msg: "created or mail not sent",
                            data: err
                        }
                        res.status(500).send(response)
                    })

                }).catch(error => {
                    log.test(error)
                    let response = {
                        status: 500,
                        msg: "created support_data not successfully",
                        data: user_data
                    }
                    res.status(500).send(response)
                })
            } catch (error) {
                let response = {
                    status: 500,
                    msg: " not created support_data successfully",
                    data: error
                }
                console.log(error);
                res.status(500).send(response)
            }
        })
        .catch((error) => console.log(error))

}