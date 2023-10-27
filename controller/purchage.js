var { Op } = require('sequelize');
const db = require("../models/index")
const log = require("../utils/log");
const { error } = require("console");

exports.purchage = async (req, res) => {
    const filter = req.body.filterTag
    const userEmail = req.body.userEmail
    var someDate = new Date();
    var numberOfDaysToAdd = 10;
    var SearchDay = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    if (filter === "Active") {
        await db.purchase.findAll({
            where: {
                email: userEmail,
                expireOn: {
                    [Op.gte]: new Date(),
                }
            }
        }).then((ExpiredData) => {
            let response = {
                status: 200,
                msg: "find all",
                data: ExpiredData
            }
            console.log("Active", ExpiredData.length);
            res.status(200).send(response)
        }).catch((err) => {
            let response = {
                status: 500,
                msg: "something wrong",
                data: err
            }
            console.log(err);
            res.status(500).send(response)
        })

    } else if (filter === "ToBeExpire") {
        await db.purchase.findAll({
            where: {
                email: userEmail,
                expireOn: {
                    [Op.and]: [
                        {[Op.gte]: new Date()},
                        {[Op.lte]: someDate}
                    ]
                }
            }
        }).then((ExpiredData) => {
            let response = {
                status: 200,
                msg: "find all",
                data: ExpiredData
            }
            console.log("ToExpired ", ExpiredData.length);
            res.status(200).send(response)
        }).catch((err) => {
            let response = {
                status: 200,
                msg: "something wrong",
                data: err
            }
            res.status(500).send(response)
        })

    } else if (filter === "Expired") {
        await db.purchase.findAll({
            where: {
                email: userEmail,
                expireOn: {
                    [Op.lte]: new Date()
                }
            }
        }).then((ExpiredData) => {
            let response = {
                status: 200,
                msg: "find all",
                data: ExpiredData
            }
            console.log("Expired ", ExpiredData.length);
            res.status(200).send(response)
        }).catch((err) => {
            let response = {
                status: 500,
                msg: "something wrong",
                data: err
            }
            res.status(500).send(response)
        })

    }else{
        let response = {
            status: 500,
            msg: "something wrong",
            data: {}
        }
        res.status(500).send(response)
    }

}


exports.addPurchase = async (req, res) => {
    try {
        const { email, marketPlaceId, invoiceId, amount, planInterval, currency, expireOn, nextAmount, otherInfo, retailAmount, token, purchaseDate } = req.body;
        await db.User.findOne({ where: { email: email } })
            .then(async (user) => {
                user = JSON.parse(JSON.stringify(user));
                await db.purchase.create({ email: email, expireOn: expireOn, userId: user.id, marketPlaceId: marketPlaceId.id, MarketPlaceName: marketPlaceId.name, LogoLink: marketPlaceId.logoLink, invoiceId: invoiceId, amount: amount, planInterval: planInterval, currency: currency, nextAmount: nextAmount, otherInfo: otherInfo, retailAmount: retailAmount, token: token, purchaseDate: purchaseDate })
                    .then((p) => {
                        return res.status(200).send({ msg: "SuccesFully Added to user" });
                    })
                    .catch((err) => {
                        return res.status(204).send('errrrr')
                    })
            })
            .catch((err) => {
                return res.status(201).send('err')
            })

    } catch (error) {
        console.log(error);
        return res.status(202).send('not ok')
    }
}