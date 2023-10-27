const db = require("../models/index")
const response = require("../utils/responsehandle")
const log = require("../utils/log");
const { error } = require("console");
const sendMailResponse = require('../utils/responseFromMarketPlace')
const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer');
const { regenerateToken } = require('./zohoAuth')
const axios = require('axios');

var sendMialAddNew = async (requestData) => {
    let name = requestData.username
    let link = requestData.link
    let requestEmail = requestData.requestEmail
    let metaData = requestData.metaData
    let appName = requestData.name
    let secure;
    if (process.env.MAIL_PORT == 465) {
        secure = true;
    } else secure = false;
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
        to: [process.env.MAIL_FROM, process.env.RESPONSE_TO], // list of receivers
        subject: `Request Form To Add Saas To MarketPlace from ${requestEmail}`, // Subject line
        // text: "we will connect you soon !", // plain text body
        // html: URL, // html body
        html: `<!DOCTYPE html><html><head> <title>Easenode - Customer Support</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 5px; } h1 { color: #333333; margin-top: 0; } p { color: #555555; line-height: 1.5; } .signature { margin-top: 30px; font-size: 14px; color: #777777; } </style></head><body> <div class="container"> <h1>From ${name} Email : ${requestEmail}</h1> <ul> <li><strong>User:</strong> ${name}</li> <li><strong>UserEmail:</strong>${requestEmail}</li><li><strong>AppName:</strong>${appName}</li><li><strong>link:</strong>${link}</li>  </ul> <p>Here is your message:</p> <blockquote> ${metaData} </blockquote> </div></body></html>`
    })
}

exports.add_new_form = async (req, res) => {
    try {
        let requestData = {
            name: req.body.name,
            link: req.body.link,
            requestEmail: req.body.email,
            metaData: req.body.message,
            username: req.body.username
        }
        await db.add_new_form.create(requestData).then(async (UpdatedData) => {
            await sendMialAddNew(requestData).then(() => {
                let response = {
                    status: 200,
                    msg: "created requestData successfully",
                    data: UpdatedData
                }
                return res.status(200).send(response)
            }).catch((err) => {
                let response = {
                    status: 500,
                    msg: "created requestData successfully but not sent mail",
                    data: err
                }
                return res.status(500).send(response)
            })

        }).catch(error => {
            log.test(error)
        })
    } catch (error) {
        let response = {
            status: 500,
            msg: " not created requestData successfully",
            data: error
        }
        console.log(error);
        res.status(500).send(response)
    }
}

exports.requestForm = async (req, res) => {
    try {
        var selectedCard = req.body.selectedCard
        var licences = req.body.licences;
        let requestData = {
            description: licences,
            metaData: selectedCard.description,
            marketPlaceId: selectedCard.marketPlaceId,
            requestEmail: req.user.email,
            name: req.user.firstName,
        }
        let access_token = await regenerateToken();
        await axios({
            'method': 'POST',
            'url': `https://desk.zoho.in/api/v1/tickets`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": `Zoho-oauthtoken ${access_token}`
            },
            'data': JSON.stringify({
                "contactId": req.user.contactId,
                "subject": `${selectedCard.name}`,
                "departmentId": "119381000000010772",
                "channel": "Email",
                "description": `Thank you for reaching out to us. We appreciate your inquiry and value your business. We are committed to providing exceptional customer service and will do our best to assist you with your request.</p> <p>If you have any further questions or need additional assistance, please feel free to contact us at [provide contact information]. Our team is here to help and will respond to your inquiry promptly.</p> <p>We genuinely appreciate your patience and understanding. Thank you for choosing Easenode for your ${selectedCard.name} with ${licences} no. of licences. We look forward to serving you.`,
                "language": "English",
                "email": `${req.user.email}`,
                "status": "Open",
                "assigneeId": "119381000000176037",
                "cf": {
                    "cf_payment_id": '0'
                },

            })
        }).then(async (resp) => {
            let response = {
                status: 200,
                msg: "created requestData successfully",
                data: resp.data
            }
            return res.status(200).send(response)
        }).catch(error => {
            console.log(error.response.data);
            let response = {
                status: 500,
                msg: "not created requestData successfully",
            }
            res.status(500).send(response)
        })
    } catch (error) {
        let response = {
            status: 500,
            msg: " not created requestData successfully",
            data: error
        }
        console.log(error);
        res.status(500).send(response)
    }
}