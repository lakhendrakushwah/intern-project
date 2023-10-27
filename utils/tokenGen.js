const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();


exports.getToken = async (details) => {
    return jwt.sign(
        details,
        process.env.JWT_AUTH_KEY,
        {
            expiresIn: '60m'
        })
}

const tokenGenerator = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.crone_token =  () => {
    let word1 = tokenGenerator();
    let word2 = tokenGenerator();
    let tokenvalue = `${word1}-xEmail-${word2}`;
    return tokenvalue;
}
exports.compose_token_gen =  () => {
    let word1 = tokenGenerator();
    let word2 = tokenGenerator();
    let tokenvalue = `${word1}-Compose-${word2}`;
    return tokenvalue;
}
exports.sqs_deduplication = () => {
    let word1 = tokenGenerator();
    let word2 = tokenGenerator();
    let tokenvalue = `${word1}-sqs-${word2}`;
    return tokenvalue;
}