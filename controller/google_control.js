const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const { SENDER } = require("../models/index");
const db = require("../models/index");
const Sequelize = require("sequelize");
const { Op, offset, limit } = require("sequelize");
const keys = require("./oauth2.keys.json");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const http = require("http");
const jwt = require("jsonwebtoken");
const tokenGen = require('../utils/tokenGen');

db.sequelize.sync();

const oAuth2Client2 = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  // keys.web.redirect_uris[process.env.GoogleAuthBackURLindex]
  keys.web.redirect_uris[2]
);

// for login
exports.authGoogleLogin = async (req, res) => {
  try {
    const authorizeUrl = oAuth2Client2.generateAuthUrl({
      access_type: "offline",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      prompt: "consent",
    });

    let response = {
      status: 200,
      msg: "redirect to url",
      data: authorizeUrl
    };

    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during Google OAuth2 process");
  }
};

exports.authRedirectLogin = async (req, res) => {
  try {
    const code = req.query.code;

    // Exchange authorization code for access token
    const r = await oAuth2Client2.getToken(code);
    oAuth2Client2.setCredentials({ access_token: r.tokens.access_token });

    // Use OAuth2Client to fetch user data
    const oauth2 = google.oauth2({ auth: oAuth2Client2, version: "v2" });
    const user_data = await oauth2.userinfo.get();
    const user_email = user_data.data.email;

    // Check if the user is already registered in the database
    const existingUser = await db.User.findOne({ where: { email: user_email } });

    if (existingUser) {
      // User is registered, generate a JWT token and set it as a cookie
      let details = {
        username: existingUser.userName,
        firstname: existingUser.firstName,
        lastname: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role
      };
      let token = await tokenGen.getToken(details);
      res.cookie("token", token);

      // User is registered, generate a new password and update it
      const refreshToken = r.tokens.refresh_token; // Implement your refresh token generation

      // Update the user's password field and save the changes
      existingUser.password = refreshToken;
      await existingUser.save();



      // Respond with success message or data
      const response = {
        status: 200,
        msg: "User logged in successfully",
        data: user_data,
      };
      res.status(200).json(response);
    } else {
      // User is not registered, register the user in the database
      let u = await db.User.create({
        userName: user_data.data.name,
        firstName: user_data.data.given_name,
        lastName: user_data.data.family_name,
        email: user_email,
        phone: null,
        password: r.tokens.refresh_token,
        type: "google",
      });
      let details = {
        username: u.userName,
        firstname: u.firstName,
        lastname: u.lastName,
        email: u.email,
        role: u.role
      };
      let token = await tokenGen.getToken(details);
      res.cookie("token", token);
      // Respond with success message or data
      const response = {
        status: 200,
        msg: "User registered and logged in successfully",
        data: user_data,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    // Handle errors and respond accordingly
    console.error(error);
    const response = {
      status: 500,
      msg: error.message, // Send the error message to the frontend
    };
    res.status(500).json(response);
  }
};






