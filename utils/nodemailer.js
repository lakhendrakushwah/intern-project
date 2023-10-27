const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer')
const db = require('../models/index')
const log = require("../utils/log");


exports.transporter = async (data) => {
    const user = await db.User.findOne({ where: { email: data.email } })
    // const link = process.env.React_ORIGIN+"/verify-account/"+ user.username+"/"
    const link = data.link;
    let secure;
    if(process.env.MAIL_PORT == 465){
        secure = true;
    } else secure = false;
    async function main() {
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
        let info = await transporter.sendMail({
            from: `"Easenode " "${process.env.MAIL_FROM}" `, // sender address
            to: user.email, // list of receivers
            subject: "Account Verification ", // Subject line
            text: "Hello world!", // plain text body
            // html: URL, // html body
            html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>XEmail Verify | Warm Up</title> <meta name="description" content="Reset Password Email Template."> <style type="text/css"> a:hover {text-decoration: underline !important;} </style></head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"> <tr> <td> <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="height:80px;">&nbsp;</td> </tr> <tr> <td style="text-align:center;"> <a href="https://app.easenode.com" title="logo" target="_blank"> <img width="300" src="https://i.ibb.co/3RTP2bc/logo.png" title="logo" alt="logo"> </a> </td> </tr><tr><td style="height:20px;">&nbsp;</td> </tr> <tr> <td> <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"> <tr> <td style="height:40px;">&nbsp;</td> </tr> <tr> <td style="padding:0 35px;"> <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Hi `+user.firstName+`,</h1> <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span> <p style="color:#455056; font-size:15px;line-height:24px; margin:0;"> <p> </p> <p>Thank you for creating an account with Easenode , please click the link below to activate your account</p> </p> <a href="`+link+`" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Activate Account</a> </td> </tr> <tr> <td style="height:40px;">&nbsp;</td> </tr> </table> </td> <tr><td style="height:20px;">&nbsp;</td> </tr><tr> <td style="text-align:center;"> </td></tr> <tr> <td style="height:80px;">&nbsp;</td> </tr> </table></td></tr></table></body></html>` // html body
        });
        log.test("",info)
        // console.log(info);
    }
    main().catch((err) => {
        log.test("nodemailer Error::::", err)
    })
}

exports.transporterForResetPass = async(data) => {
    const user = await db.User.findOne({ where: { email: data.email } })
    // const link = process.env.React_ORIGIN+"/verify-account/"+ user.username+"/"
    const link = data.link;
    let secure;
    if(process.env.MAIL_PORT == 465){
        secure = true;
    } else secure = false;
    async function main() {
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
        let info = await transporter.sendMail({
            from: `"Easenode " "${process.env.MAIL_FROM}" `, // sender address
            to: user.email, // list of receivers
            subject: "Password Reset ", // Subject line
            text: "Hello world!", // plain text body
            // html: URL, // html body
            html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>XEmail Verify | Warm Up</title> <meta name="description" content="Reset Password Email Template."> <style type="text/css"> a:hover {text-decoration: underline !important;} </style></head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"> <tr> <td> <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="height:80px;">&nbsp;</td> </tr> <tr> <td style="text-align:center;"> <a href="https://app.easenode.com" title="logo" target="_blank"> <img width="300" src="https://i.ibb.co/3RTP2bc/logo.png" title="logo" alt="logo"> </a> </td> </tr><tr><td style="height:20px;">&nbsp;</td> </tr> <tr> <td> <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"> <tr> <td style="height:40px;">&nbsp;</td> </tr> <tr> <td style="padding:0 35px;"> <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Hi `+user.firstName+`,</h1> <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span> <p style="color:#455056; font-size:15px;line-height:24px; margin:0;"> <p> </p> <p>Thank you for choosing Easenode , please click the link below to reset your account password</p> </p> <a href="`+link+`" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a> </td> </tr> <tr> <td style="height:40px;">&nbsp;</td> </tr> </table> </td> <tr><td style="height:20px;">&nbsp;</td> </tr><tr> <td style="text-align:center;"> </td></tr> <tr> <td style="height:80px;">&nbsp;</td> </tr> </table></td></tr></table></body></html>` // html body
        });
        // console.log(info);
    }
    main().catch((err) => {
        log.test("nodemailer Error::::", err)
    })
}