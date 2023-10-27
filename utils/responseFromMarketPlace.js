const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer')
const db = require('../models/index')
const log = require("../utils/log");

exports.sendMail = async (appName, requestData) => {
  let name = requestData.name
  let description = requestData.description
  let metaData = requestData.metaData
  let marketPlaceId = requestData.marketPlaceId
  let requestEmail = requestData.requestEmail
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
      to: [process.env.RESPONSE_TO], // list of receivers
      subject: `request form from ${requestEmail}`, // Subject line
      text: "we will connect you soon !", // plain text body
      // html: URL, // html body
      html: `<!DOCTYPE html><html><head> <title>Easenode - Customer Support</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 5px; } h1 { color: #333333; margin-top: 0; } p { color: #555555; line-height: 1.5; } .signature { margin-top: 30px; font-size: 14px; color: #777777; } </style></head><body> <div class="container"> <h1>From ${name} Email : ${requestEmail}</h1> <ul> <li><strong>User:</strong> ${name}</li> <li><strong>UserEmail:</strong>${requestEmail}</li> <li><strong>Description:</strong> ${description}</li> <li><strong>Marketplace ID:</strong>${marketPlaceId}</li> <li><strong>Marketplace AppName:</strong>${appName}</li> </ul> <p>Here is your message:</p> <blockquote> ${metaData} </blockquote> </div></body></html>`
    })
    if (info) {
      await transporter.sendMail({
        from: `"Easenode " "${process.env.MAIL_FROM}" `, // sender address
        to: [requestEmail], // list of receivers
        subject: `Thank you we have received request for ${appName}`, // Subject line
        text: "our team will connect you soon !", // plain text body
        html: `<!DOCTYPE html><html><head> <title>Easenode - Customer Support</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 5px; } h1 { color: #333333; margin-top: 0; } p { color: #555555; line-height: 1.5; } .signature { margin-top: 30px; font-size: 14px; color: #777777; } </style></head><body> <div class="container"> <h1>Easenode Tech - Customer Support</h1> <p>Dear ${name},</p> <p>Thank you for reaching out to us. We appreciate your inquiry and value your business. We are committed to providing exceptional customer service and will do our best to assist you with your request.</p> <p>If you have any further questions or need additional assistance, please feel free to contact us at [provide contact information]. Our team is here to help and will respond to your inquiry promptly.</p> <p>We genuinely appreciate your patience and understanding. Thank you for choosing Easenode for your ${appName}. We look forward to serving you.</p> <div class="signature"> <p>Best regards</p> <p>Easenode Tech<br>Private Limited </p> <p><a href="mailto:kaustubh@easenode.com">kaustubh@easenode.com</a></p> </div> </div></body></html>`
      }).then((info_2) => {
        let response = {
          status: 200,
          msg: "sent mail successfully",
          data: info
        }
        console.log(response);
        return response
        // res.status(200).send(response)
      }).catch((error) => {
        let response = {
          status: 500,
          msg: "sent mail not successfully to user",
          data: info
        }
        return response
      })
    }
    else {
      let response = {
        status: 500,
        msg: "sent mail not successfully to both",
        data: info
      }
      return response
    }
  } catch (error) {
    log.dev("error", error)
    let response = {
      status: 500,
      msg: "sent mail not successfully to both",
      data: info
    }
    return response
    throw error
  }
}