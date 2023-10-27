const dotenv = require('dotenv').config()
exports.test = async (msg, data) => {
    if (process.env.TEST_LOGS != 0) {
        return console.log(msg, data)
    }
}

exports.dev = async (msg, data) => {
    if (process.env.DEV_LOGS != 0) {
        return console.log(msg, data)
    }

}