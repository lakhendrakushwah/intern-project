const express = require("express");
const app = express.Router();
const multer = require('multer');
const path = require('path')
var bodyParser = require('body-parser')
const { isAuthenticated, isAdmin } = require("./middleware/auth");
const { authGoogleSignUp } = require('./controller/google_control');
const { authGoogleLogin } = require('./controller/google_control');
const { authRedirectSignUp } = require('./controller/google_control');
const { authRedirectLogin } = require('./controller/google_control');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const authController = require('./controller/authController')
const requestForm = require("./controller/requestForm")
const saasController = require('./controller/saasController');
const trackingController = require('./controller/trackingController');
const billingController = require('./controller/billingController');
const purchage = require('./controller/purchage');
const { log, error } = require("console");
const db = require("./models");
const updateProfile = require("./controller/profile")
const support = require('./controller/support')
const google = require("./controller/google_control")
const extra = require('./utils/extra')

app.get('/', authController.home)
app.post('/register', authController.register)
app.post('/login', authController.login);
app.get("/verify-account/:username", authController.verify); // route to verify account via sended link
app.post("/verify-account", authController.resendVerifyEmail); // route to send email for account verification link
app.post('/forgot-password', authController.forgotPassword); // route to send email to reset password
app.post("/reset-passward", authController.resetPassword);
app.get("/reset-password/:forgotToken", authController.resetPasswordRedirect);
app.post("/update-password", isAuthenticated, authController.updatePassword); // route to update password
app.post("/update-profile", isAuthenticated, updateProfile.profileUpdate);
app.post("/support", isAuthenticated, support.support);
app.post("/request-form", isAuthenticated, requestForm.requestForm)
app.post("/add_new_form", isAuthenticated, requestForm.add_new_form)
app.post("/purchage", purchage.purchage)
app.get('/profile', isAuthenticated, authController.profile);
// app.post('/profileupdate',isAuthenticated,authController.profileUpdate);
app.get('/profileupdate', isAuthenticated, authController.logout);
app.get('/logout', authController.logout)
app.get('/redirect', extra.redirect)
app.post('/zoho_webhook', billingController.zoho_webhook)
app.get('/fetch-saas', saasController.fetchSaas)
app.get('/fetch-saas-invoice', isAuthenticated, saasController.fetchSaasInvoice)
// routes for google login and signup
app.get('/googlereactSignUp', authGoogleLogin);
app.get('/googlereactLogin', authGoogleLogin);

app.get('/googleLogin', authRedirectLogin);
app.post('/fetch-saas-product',isAuthenticated, saasController.fetchSaasProduct)
app.get('/getAllTickets', isAuthenticated, trackingController.getAllTickets);
app.post('/getAllThreads', isAuthenticated, trackingController.getAllThreads);
app.get('/getBilling', isAuthenticated, billingController.getBills);
app.post('/sendReply', isAuthenticated, trackingController.senReply);
app.get('/get_region', isAuthenticated, saasController.get_region);
app.post('/set_region', isAuthenticated, saasController.set_region);

app.get('/fetch-user', async (req, res) => {
    try {
        let users = await db.User.findAll()
            .catch((err) => {
                console.log("unable to find");
                return res.status(201).send("unable to find")
            })
        return res.status(200).send(users)
    } catch (error) {
        console.log("try catch error:", error);
        return res.status(202).send(`try catch error:${error}`)
    }
})

app.get('/complete_data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.purchase.findAll({ where: { email: id } })
            .then(async (data) => {
                data = JSON.parse(JSON.stringify(data))
                var responseData = {
                    totalSpent: 0,
                    totalSaving: 0
                };
                for (let index = 0; index < data.length; index++) {
                    const ele = data[index];
                    responseData.totalSpent = responseData.totalSpent + ele.amount;
                    responseData.totalSaving = responseData.tothandleData[i].expireOnalSaving + ele.nextAmount;
                }
                responseData['status'] = 200;
                return res.status(200).send(responseData)
            })
            .catch((error) => {
                return res.status(201).send(`error in finding: ${error}`)
            })
    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
})
app.post('/add-purchase',purchage.addPurchase )

const add_data = async (dataIndex) => {
    return new Promise(async (resolve, reject) => {
        var saasData = await db.marketPlace.findOne({ where: { id: dataIndex.marketPlaceId } })
        saasData = JSON.parse(JSON.stringify(saasData))
        if (saasData) {
            let purchaseDate = dataIndex.createdAt
            let d = purchaseDate.split('T')[0];
            var arrayIndexData = {
                logoLink: saasData.logoLink,
                name: saasData.name,
                amount: dataIndex.amount,
                savingAmount: dataIndex.nextAmount,
                purchaseDate: d,
                expireOn: dataIndex.expireOn,
                tokenId: dataIndex.invoiceId,
                saasData: saasData,
            }
            resolve(arrayIndexData);
        } else {
            resolve();
        }
    })
}

app.get('/my-apps',isAuthenticated, saasController.myApps)
app.post('/autoRenewToggle',isAuthenticated, saasController.autoRenewToggle)
var mappingPieData = (sendData) => {
    return new Promise((resolve, reject) => {
        const map = [];
        for (let i = 0; i < sendData.length; i++) {
            const ele = sendData[i];
            const foundObject = map.findIndex(obj => obj.MarketPlaceName === ele.marketplaceName);
            if(foundObject == -1){
                map.push({
                    "MarketPlaceName": ele.marketplaceName,
                    "amount" : (ele.chargePerMonth * ele.noOfLicences)
                })
            } else {
                map[foundObject].amount += (ele.chargePerMonth * ele.noOfLicences)
            }
        }
        resolve(map);
    })
}

app.get('/allPurchase/:id',isAuthenticated, async (req, res) => {
    let id = req.user.id
    try {
        await db.subscription.findAll({ where: { userId: id } })
            .then(async (SendData) => {
                SendData = JSON.parse(JSON.stringify(SendData))
                await mappingPieData(SendData).then((pieData) => {
                    let response = {
                        status: 200,
                        msg: "find successfully",
                        data: SendData,
                        pieData: pieData
                    }
                    res.status(200).send(response)
                })
            })
            .catch((error) => {
                let response = {
                    status: 500,
                    msg: `error in finding: ${error}`,
                    data: error
                }
                res.status(500).send(response)
            })

    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
})

const formateDataBar = async (getData) => {
    new Promise((resolve, reject) => {

        // resolve(responseData)
        // return;
    })

}
app.get('/allMarketPlaceBar/:id', async (req, res) => {
    let id = req.params.id
    try {
        await db.marketPlace.findAll()
            .then(async (SendData) => {
                let getData = JSON.parse(JSON.stringify(SendData))
                let responseData = [];
                for (let id = 0; id < getData.length;) {
                    const element = getData[id];
                    let dd = {
                        name: element.name,
                        PricePercentage: element.relativePercentage
                    }
                    responseData.push(dd)
                    id++;
                }
                let response = {
                    status: 200,
                    msg: "find successfully",
                    data: responseData
                }
                res.status(200).send(response)
            })
            .catch((error) => {
                console.log("error", error);
                let response = {
                    status: 500,
                    msg: `error in finding: ${error}`,
                    data: error
                }
                res.status(500).send(response)
            })

    } catch (error) {
        return res.status(202).send(`try catch error: ${error}`)
    }
})

//Admin Routes
app.post('/webhook',saasController.webhook);
app.get('/admin/check',isAuthenticated, isAdmin, (req, res) => {
    return res.status(200).send({
        msg: "U are a admin"
    })
})

app.post('/admin/add-saas',isAuthenticated, isAdmin, saasController.addSaas)

app.post('/admin/update-saas',isAuthenticated, isAdmin, saasController.updateSaas)

app.delete('/admin/delete-saas',isAuthenticated, isAdmin, (req, res) => {
    try {

    } catch (error) {
        console.log('catch error:', error);
        return res.status(201).send(`catch error:',error`)
    }

})

app.post('/admin/add-purchase',isAuthenticated, isAdmin, purchage.addPurchase)
app.post('/admin/sendInvoice', isAuthenticated, isAdmin, billingController.sendInvoice);



module.exports = app;