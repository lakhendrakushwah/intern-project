const db = require("../models/index")
const response = require("../utils/responsehandle")
const log = require("../utils/log");
const { where } = require("sequelize");
const dotenv = require('dotenv').config()
db.sequelize.sync();
const { regenerateToken } = require('./zohoAuth');
const axios = require('axios');


exports.addSaas = async (req, res) => {
    console.log(req.body);
    var { title, info, logoLink, tags, relativePercentage } = req.body;
    try {
        // const user = await db.User.findOne({ where: { email: email } })
        let saas = await db.marketPlace.findOne({ where: { name: title } })
            .catch((err) => {
                console.log("err rrr", err);
                res.status(201).send("something went wrong in verify marketplace")
            })
        if (saas) {
            return res.status(202).send("already in database")
        }
        else {
            await db.marketPlace.create({ name: title, info: info, logoLink: logoLink, type2: tags, relativePercentage: relativePercentage })
                .then((data) => {
                    return res.status(200).send("added successfully")
                })
                .catch((err) => {
                    console.log("erererere:", err);
                    return res.status(203).send('problem while adding')
                })
        }
    } catch (error) {
        console.log("try catch error:", error);
        return res.status(203).send('try catch error:')
    }
}

exports.fetchSaas = async (req, res) => {
    try {
        await db.marketPlace.findAll()
            .then(async (data) => {
                data = JSON.stringify(data)
                return res.status(200).send(data)
            })
            .catch(async (err) => {
                console.log('catch error:', err);
                return res.status(202).send(err);
            })
    } catch (error) {
        console.log(`Try Catch error:${error}`);
        res.status(201).send(`Try Catch error:${error}`)
    }
}

exports.fetchSaasInvoice = async (req, res) => {
    try {
        await db.region.findOne({
            where: {
                id: req.user.currentRegion
            }
        }).then(async (r) => {
            await db.marketPlaceProduct.findAll({
                where: {
                    currentRegion: r.id
                }
            })
                .then(async (data) => {
                    data = JSON.parse(JSON.stringify(data));
                    for (let i = 0; i < data.length;) {
                        const ele = data[i];
                        await db.marketPlace.findOne({
                            where: {
                                id: ele.marketplaceId
                            }
                        }).then(async (mp) => {
                            data[i]['marketPlaceName'] = mp.name;
                            i++;
                            if (i === data.length) {
                                return res.status(200).send(JSON.stringify(data));
                            }
                        })
                    }
                })
                .catch(async (err) => {
                    console.log('catch error:', err);
                    return res.status(202).send(err);
                })
        })
    } catch (error) {
        console.log(`Try Catch error:${error}`);
        res.status(201).send(`Try Catch error:${error}`)
    }
}

exports.updateSaas = async (req, res) => {
    try {
        const { id, name, logoLink, type2, info, relativePercentage } = req.body;
        await db.marketPlace.update({ name: name, logoLink: logoLink, type2: type2, info: info, relativePercentage: parseInt(relativePercentage) }, { where: { id: id } })
            .then(async () => {
                return res.status(200).send('updated successfully')
            })
            .catch(async (error) => {
                console.log('upadte error:', error);
                return res.status(201).send(`'upadte error:',error`)
            })

    } catch (error) {
        console.log('catch error:', error);
        return res.status(201).send(`catch error:',error`)
    }
}

exports.fetchSaasProduct = async (req, res) => {
    try {
        let marketplaceId = req.body.marketplaceId;
        await db.marketPlaceProduct.findAll({
            where: {
                marketplaceId: marketplaceId,
                currentRegion: req.user.currentRegion
            }
        }).then((data) => {
            data = JSON.parse(JSON.stringify(data));
            let map = {};
            for (let i = 0; i < data.length; i++) {
                const ele = data[i];
                if (!map[ele.interval]) {
                    map[ele.interval] = {};
                }
                if (!map[ele.interval][ele.type]) {
                    map[ele.interval][ele.type] = []
                }
                map[ele.interval][ele.type].push(ele);
            }
            return res.status(200).send({
                msg: "Success",
                data: map
            })
        }).catch((err) => {
            console.log(err);
            return res.status(201).send({
                msg: "Error",
                data: err,
                status: 201
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(201).send({ msg: `catch error:',error` })
    }
}

exports.myApps = async (req, res) => {
    try {
        let bills = {
            'Next Invoice': {}
        };
        await db.User.findOne({
            where: {
                email: req.user.email
            }
        }).then(async (u) => {
            await db.region.findOne({
                where: {
                    id: u.currentRegion
                }
            }).then(async (r) => {
                await db.subscription.findAll({
                    where: {
                        userId: u.id,
                        currency: r.currency
                    }
                }).then(async (s) => {
                    for (let i = 0; i < s.length; i++) {
                        const ele = s[i];
                        if (!bills["Next Invoice"][`${ele.marketplaceName}`]) {
                            bills["Next Invoice"][`${ele.marketplaceName}`] = {
                                amount: 0,
                                currency: ele.currency,
                                noOfLicences: 0,
                                data: []
                            };
                        }
                        bills["Next Invoice"][`${ele.marketplaceName}`].amount += (ele.chargePerMonth * ele.noOfLicences);
                        bills["Next Invoice"][`${ele.marketplaceName}`].noOfLicences += (ele.noOfLicences);
                        bills["Next Invoice"][`${ele.marketplaceName}`]['data'].push(ele);
                    }

                    return res.status(200).send({
                        msg: "Success",
                        data: bills,
                        status: 200
                    });
                }).catch((err) => {
                    console.log(err);
                    return res.status(201).send({
                        msg: "Something went wrong",
                        status: 201
                    });
                })
            })
        }).catch((err) => {
            console.log(err);
            return res.status(201).send({
                msg: "Something went wrong",
                status: 201
            });
        })
    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
}

exports.autoRenewToggle = async (req, res) => {
    try {
        await db.subscription.update({
            autoRenew: req.body.isTrue
        }, {
            where: {
                id: req.body.id
            }
        }).then(async (s) => {
            return res.status(200).send({
                msg: "Success",
                status: 200
            });
        }).catch((err) => {
            console.log(err);
            return res.status(201).send({
                msg: "Something went wrong",
                status: 201
            });
        })
    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
}

exports.webhook = async (req, res) => {
    let event = req.body;
    let email;
    // Handle the event
    switch (event.type) {
        case 'invoice.created':
            const invoiceCreated = event.data.object;
            // Then define and call a function to handle the event invoice.created
            break;
        case 'invoice.finalized':
            const invoiceFinalized = event.data.object;
            // Then define and call a function to handle the event invoice.finalized
            break;
        case 'invoice.paid':
            const invoicePaid = event.data.object;
	    email = invoicePaid.customer_email;
            if (invoicePaid.metadata) {
                await db.payment.update({
                    status: 'completed',
                }, {
                    where: {
                        id: invoicePaid.metadata.payment_id
                    }
                }).then(async () => {
                    let access_token = await regenerateToken();
                    await axios({
                        'method': 'PATCH',
                        'url': `https://desk.zoho.in/api/v1/tickets/${invoicePaid.metadata.ticket_id}`,
                        'headers': {
                            'orgId': '60022959159',
                            "Authorization": `Zoho-oauthtoken ${access_token}`
                        },
                        'data': JSON.stringify({
                            "status": "Invoice Paid",
                            "cf": {
                                "cf_payment_id": invoicePaid.metadata.payment_id
                            }
                        })
                    }).then(async () => {
                        await axios({
                            'method': 'POST',
                            'url': `https://desk.zoho.in/api/v1/tickets/${invoicePaid.metadata.ticket_id}/sendReply`,
                            'headers': {
                                'orgId': '60022959159',
                                "Authorization": `Zoho-oauthtoken ${access_token}`
                            },
                            'data': {
                                "channel": "EMAIL",
                                "to": `${email}`,
                                "fromEmailAddress": "support@easenode.zohodesk.in",
                                "contentType": "html",
                                "content": `Your Payment has been successfull. Our Agent will connect with you for furthur assistance and approval of your service. \n Thank You!!`,
                                "cc": `kaustubh@easenode.com`
                            }
                        }).then(async () => { }).catch((err) => {
                            console.log(err);
                        });
                    }).catch(error => {
                        console.log(error);
                    })
                })
            }
            break;
        case 'invoice.payment_failed':
            const invoicePaymentFailed = event.data.object;
	        email = invoicePaymentFailed.customer_email;
            if (invoicePaymentFailed.metadata) {
                await db.payment.update({
                    status: 'failed'
                }, {
                    where: {
                        id: invoicePaymentFailed.metadata.payment_id
                    }
                }).then(async () => {
                    let access_token = await regenerateToken();
                    await axios({
                        'method': 'POST',
                        'url': `https://desk.zoho.in/api/v1/tickets/${invoicePaymentFailed.metadata.ticket_id}/sendReply`,
                        'headers': {
                            'orgId': '60022959159',
                            "Authorization": `Zoho-oauthtoken ${access_token}`
                        },
                        'data': {
                            "channel": "EMAIL",
                            "to": `${email}`,
                            "fromEmailAddress": "support@easenode.zohodesk.in",
                            "contentType": "html",
                            "content": `Your Payment has been Failed.Contact Our Agent for furthur assistance and approval of your service. \n Thank You!!`,
                            "cc": `kaustubh@easenode.com`
                        }
                    }).then(async () => { }).catch((err) => {
                        console.log(err);
                    });
                })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send({ status: "true" });
}

exports.get_region = async (req, res) => {
    try {
        await db.region.findAll().then(async (r) => {
            await db.User.findOne({
                where: {
                    id: req.user.id
                }
            }).then((u) => {
                return res.status(200).send({
                    status: 200,
                    data: JSON.parse(JSON.stringify(r)),
                    currentRegion: u.currentRegion
                })
            })
        })
    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
}

exports.set_region = async (req, res) => {
    try {
        const newR = req.body.rId;
        await db.User.update({
            currentRegion: newR
        }, {
            where: {
                id: req.user.id
            }
        }).then(() => {
            return res.status(200).send({
                status: 200,
                msg: "Succesfully Updated"
            })
        })
    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
}