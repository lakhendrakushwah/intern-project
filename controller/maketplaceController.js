const db = require("../models/index")
const response = require("../utils/responsehandle")

exports.addMarketplace = async (req, res) => {
    log.test("home called", "")
    res.send('hello Home route');
}