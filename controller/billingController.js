const db = require("../models/index");
const { Op } = require('sequelize');
const stripe = require('stripe')(`${process.env.STRIPE_SECRET}`);
const { regenerateToken } = require('./zohoAuth');
const axios = require('axios');
const { CurrencyRuble } = require("@mui/icons-material");

exports.getBills = async (req, res) => {
    try {
        let bills = {
            'Pending': [],
            'History': [],
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
                await db.payment.findAll({
                    where: {
                        status: {
                            [Op.or]: ['pending', 'completed'],
                        },
                        currency: r.currency,
                        userId: u.id
                    }
                }).then(async (p) => {
                    await db.subscription.findAll({
                        where: {
                            userId: u.id,
                            currency: r.currency,
                            active: "true"
                        }
                    }).then(async (s) => {
                        for (let i = 0; i < p.length; i++) {
                            const ele = p[i];
                            if (ele.status === 'pending') {
                                bills.Pending.push(ele);
                            } else if (ele.status === 'completed') {
                                bills.History.push(ele);
                            }
                        }

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
        return res.status(201).send({
            msg: "Something went wrong",
            status: 201
        });
    }
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

var currentMonthAmount = (x) => {
    x = Number(x);
    var date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    let daysInCurrentMonth;
    var time = new Date(date.getTime());
    time.setMonth(date.getMonth() + 1);
    time.setDate(0);
    let rem = time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
    daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    let total = ((x / daysInCurrentMonth) * rem).toFixed(3);
    total = Number(total);
    return total + x;
}

exports.sendInvoice = async (req, res) => {
    try {
        let { email, ticket_id, product_id, noOfLicences, line1, postal_code, city, state, country } = req.body;
        await db.User.findOne({
            where: {
                email: email
            }
        }).then(async (us) => {
            if (!us.customerId) {
                await stripe.customers.create({
                    email: email,
                    name: us.firstName,
                    address: {
                        line1: line1,
                        postal_code: postal_code,
                        city: city,
                        state: state,
                        country: country,
                    },
                }).then(async (cus) => {
                    await db.User.update({
                        customerId: cus.id
                    }, {
                        where: {
                            email: email
                        }
                    }).then(async (u) => {
                        await db.marketPlaceProduct.findOne({
                            where: {
                                id: product_id
                            }
                        }).then(async (mp) => {
                            const currentDate = new Date();
                            const tomorrowDate = new Date(currentDate);
                            tomorrowDate.setDate(currentDate.getDate() + 1);
                            const unixTimestampTomorrow = Math.floor(tomorrowDate.getTime() / 1000);
                            await db.marketPlace.findOne({
                                where: {
                                    id: mp.marketplaceId
                                }
                            }).then(async (m) => {
                                let amt = currentMonthAmount(mp.pricePerUnit) * noOfLicences;
                                await db.payment.create({
                                    userId: us.id,
                                    marketplaceId: mp.marketplaceId,
                                    marketplaceName: m.name,
                                    productId: mp.id,
                                    productName: mp.name,
                                    amount: amt,
                                    currency: mp.currency,
                                    status: 'pending',
                                    noOfLicences: noOfLicences,
                                    createdAt: tomorrowDate
                                }).then(async (pay) => {
                                    await stripe.invoices.create({
                                        customer: cus.id,
                                        due_date: unixTimestampTomorrow.toString(),
                                        collection_method: 'send_invoice',
                                        metadata: {
                                            ticket_id: ticket_id,
                                            payment_id: pay.id
                                        },
                                        currency: mp.currency
                                    }).then(async (invoice) => {
                                        await stripe.invoiceItems.create({
                                            customer: cus.id,
                                            invoice: invoice.id,
                                            currency: mp.currency,
                                            description: mp.name,
                                            unit_amount_decimal: currentMonthAmount(mp.pricePerUnit) * 100,
                                            quantity: noOfLicences,
                                            tax_rates: ['txr_1Nfh2ESInG6niEqMHe6qhrh1']
                                        }).then(async () => {
                                            await stripe.invoices.finalizeInvoice(
                                                invoice.id
                                            ).then(async (invo) => {
                                                await db.payment.update({
                                                    link: invo.hosted_invoice_url
                                                }, {
                                                    where: {
                                                        id: pay.id
                                                    }
                                                }).then(async () => {
                                                    let access_token = await regenerateToken();
                                                    await axios({
                                                        'method': 'POST',
                                                        'url': `https://desk.zoho.in/api/v1/tickets/${ticket_id}/sendReply`,
                                                        'headers': {
                                                            'orgId': '60022959159',
                                                            "Authorization": `Zoho-oauthtoken ${access_token}`
                                                        },
                                                        'data': {
                                                            "channel": "EMAIL",
                                                            "to": `${email}`,
                                                            "fromEmailAddress": "support@easenode.zohodesk.in",
                                                            "contentType": "html",
                                                            "content": `We have generated an invoice for you to pay. pay it before due date to continue with the service. thank you \n ${invo.hosted_invoice_url}`,
                                                            "cc": `kaustubh@easenode.com`
                                                        }
                                                    }).then(async () => {
                                                        await axios({
                                                            'method': 'PATCH',
                                                            'url': `https://desk.zoho.in/api/v1/tickets/${ticket_id}`,
                                                            'headers': {
                                                                'orgId': '60022959159',
                                                                "Authorization": `Zoho-oauthtoken ${access_token}`
                                                            },
                                                            'data': JSON.stringify({
                                                                "status": "Invoice Generated"
                                                            })
                                                        }).then(async (resp) => {
                                                            return res.status(200).send({ msg: "Successfully Fetched", data: resp.data, status: 200 });
                                                        }).catch(error => {
                                                            console.log(error);
                                                        })
                                                    }).catch((err) => {
                                                        console.log(err);
                                                        return res.status(201).send({ msg: `Something Went Wrong` })
                                                    });
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            } else {
                await stripe.customers.update(us.customerId, {
                    address: {
                        line1: line1,
                        postal_code: postal_code,
                        city: city,
                        state: state,
                        country: country,
                    },
                }).then(async (cus) => {
                    console.log(cus);
                    await db.marketPlaceProduct.findOne({
                        where: {
                            id: product_id
                        }
                    }).then(async (mp) => {
                        const currentDate = new Date();
                        const tomorrowDate = new Date(currentDate);
                        tomorrowDate.setDate(currentDate.getDate() + 1);
                        const unixTimestampTomorrow = Math.floor(tomorrowDate.getTime() / 1000);
                        await db.marketPlace.findOne({
                            where: {
                                id: mp.marketplaceId
                            }
                        }).then(async (m) => {
                            let amt = currentMonthAmount(mp.pricePerUnit) * noOfLicences;
                            await db.payment.create({
                                userId: us.id,
                                marketplaceId: mp.marketplaceId,
                                marketplaceName: m.name,
                                productId: mp.id,
                                productName: mp.name,
                                amount: amt,
                                currency: mp.currency,
                                status: 'pending',
                                noOfLicences: noOfLicences,
                                createdAt: tomorrowDate
                            }).then(async (pay) => {
                                await stripe.invoices.create({
                                    customer: us.customerId,
                                    due_date: unixTimestampTomorrow.toString(),
                                    collection_method: 'send_invoice',
                                    metadata: {
                                        ticket_id: ticket_id,
                                        payment_id: pay.id
                                    },
                                    currency: mp.currency
                                }).then(async (invoice) => {
                                    await stripe.invoiceItems.create({
                                        customer: us.customerId,
                                        invoice: invoice.id,
                                        currency: mp.currency,
                                        description: mp.name,
                                        unit_amount_decimal: currentMonthAmount(mp.pricePerUnit) * 100,
                                        quantity: noOfLicences,
                                        tax_rates: ['txr_1Nfh2ESInG6niEqMHe6qhrh1']
                                    }).then(async () => {
                                        await stripe.invoices.finalizeInvoice(
                                            invoice.id
                                        ).then(async (invo) => {
                                            await db.payment.update({
                                                link: invo.hosted_invoice_url
                                            }, {
                                                where: {
                                                    id: pay.id
                                                }
                                            }).then(async () => {
                                                let access_token = await regenerateToken();
                                                await axios({
                                                    'method': 'POST',
                                                    'url': `https://desk.zoho.in/api/v1/tickets/${ticket_id}/sendReply`,
                                                    'headers': {
                                                        'orgId': '60022959159',
                                                        "Authorization": `Zoho-oauthtoken ${access_token}`
                                                    },
                                                    'data': {
                                                        "channel": "EMAIL",
                                                        "to": `${email}`,
                                                        "fromEmailAddress": "support@easenode.zohodesk.in",
                                                        "contentType": "html",
                                                        "content": `We have generated an invoice for you to pay. pay it before due date to continue with the service. thank you \n ${invo.hosted_invoice_url}`,
                                                        "cc": `kaustubh@easenode.com`
                                                    }
                                                }).then(async () => {
                                                    await axios({
                                                        'method': 'PATCH',
                                                        'url': `https://desk.zoho.in/api/v1/tickets/${ticket_id}`,
                                                        'headers': {
                                                            'orgId': '60022959159',
                                                            "Authorization": `Zoho-oauthtoken ${access_token}`
                                                        },
                                                        'data': JSON.stringify({
                                                            "status": "Invoice Generated"
                                                        })
                                                    }).then(async (resp) => {
                                                        return res.status(200).send({ msg: "Successfully Fetched", data: resp.data, status: 200 });
                                                    }).catch(error => {
                                                        console.log(error);
                                                    })
                                                }).catch((err) => {
                                                    console.log(err);
                                                    return res.status(201).send({ msg: `Something Went Wrong` })
                                                });
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(201).send({
            msg: "Something went wrong",
            status: 201
        });
    }
}

exports.zoho_webhook = async (req, res) => {
    try {
        console.log(req.body);
        let new_status = req.body[0]['payload']['status'];
        if (new_status === 'Completed') {
            let payment_id = req.body[0]['payload']['cf']['cf_payment_id'];
            console.log(payment_id);
            await db.payment.findOne({
                where: {
                    id: payment_id
                }
            }).then(async (pay) => {
                await db.subscription.findOne({
                    where: {
                        userId: pay.userId,
                        marketplaceId: pay.marketplaceId,
                        productId: pay.productId
                    }
                }).then(async (sub) => {
                    if (sub) {
                        await db.subscription.update({
                            noOfLicences: sub.noOfLicences + pay.noOfLicences
                        }, {
                            where: {
                                id: sub.id
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                        return res.status(200).send({
                            message: 'Ok'
                        })
                    } else {
                        await db.marketPlaceProduct.findOne({
                            where: {
                                id: pay.productId
                            }
                        }).then(async (mp) => {
                            await db.subscription.create({
                                userId: pay.userId,
                                marketplaceId: pay.marketplaceId,
                                marketplaceName: pay.marketplaceName,
                                productId: pay.productId,
                                productName: pay.productName,
                                chargePerMonth: mp.pricePerUnit,
                                currency: mp.currency,
                                active: 'true',
                                autoRenew: 'true',
                                noOfLicences: pay.noOfLicences
                            }).catch((err) => {
                                console.log(err);
                            })
                            return res.status(200).send({
                                message: 'Ok'
                            })
                        })
                    }
                })
            })
        }
    } catch (error) {
        return res.status(200).send({
            message: 'Something Went Wrong'
        })
    }
}