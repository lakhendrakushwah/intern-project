const axios = require('axios');
const { regenerateToken } = require('./zohoAuth');

exports.getAllThreads = async (req, res) => {
    let ticketId = (req.body.ticket).split('|')[2];
    let access_token = await regenerateToken();
    await axios({
        'method': 'GET',
        'url': `https://desk.zoho.in/api/v1/tickets/${ticketId}/threads`,
        'headers': {
            'orgId': '60022959159',
            "Authorization": `Zoho-oauthtoken ${access_token}`
        },
    }).then(async (resp) => {
        let result = [];
        for (let i = 0; i < resp.data.data.length;) {
            const id = resp.data.data[i].id;
            await axios({
                'method': 'GET',
                'url': `https://desk.zoho.in/api/v1/tickets/${ticketId}/threads/${id}?include=plainText`,
                'headers': {
                    'orgId': '60022959159',
                    "Authorization": `Zoho-oauthtoken ${access_token}`
                }
            }).then(async (th) => {
                result.push(th.data)
                i++;
            }).catch((err) => {
                console.log(err);
                i++;
            });
        }
        return res.status(200).send({
            msg: "Succssfully fetch all threads",
            data: result
        })
    }).catch((err) => {
        console.log(err);
        return res.status(201).send({ msg: `Something Went Wrong` })
    });
}

var getTickets = async (user, access_token) => {
    let data = [];
    return new Promise(async (resolve, reject) => {
        await axios({
            'method': 'GET',
            'url': `https://desk.zoho.in/api/v1/contacts/${user.contactId}/tickets`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": `Zoho-oauthtoken ${access_token}`
            },
        }).then(async (resp) => {
            if(!resp.data.data){
                resolve(data);
                return;
            }
            for (let i = 0; i < resp.data.data.length;) {
                const ele = resp.data.data[i];
                data.push(`${ele.subject}|${ele.status}|${ele.id}`);
                i++;
                if (i === resp.data.data.length) {
                    resolve(data);
                    return;
                }
            }
        }).catch((err) => {
            console.log(err);
            reject();
            return;
        });
    })
}

exports.getAllTickets = async (req, res) => {
    try {
        let user = req.user;
        let access_token = await regenerateToken();
        await getTickets(user, access_token).then((data) => {
            return res.status(200).send({ msg: "Successfully Fetched", data: data, status: 200 });
        }).catch((err) => {
            console.log(err);
            return res.status(201).send({ msg: `Something Went Wrong` })
        });
    } catch (error) {
        console.log(error);
        return res.status(201).send({ msg: `Something Went Wrong` })
    }
}

exports.senReply = async (req, res) => {
    try {
        let user = req.user;
        let access_token = await regenerateToken();
        await axios({
            'method': 'POST',
            'url': `https://desk.zoho.in/api/v1/tickets/${req.body.selectedTicket}/sendReply`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": `Zoho-oauthtoken ${access_token}`
            },
            'data': {
                "ticketStatus": "Open",
                "channel": "EMAIL",
                "to": `kaustubh@easenode.com`,
                "fromEmailAddress": "support@easenode.zohodesk.in",
                "contentType": "html",
                "content": `${req.body.replyValue}`,
                "inReplyToThreadId": `${req.body.selectedThread}`,
                "cc": `${user.email}`
            }
        }).then(async (resp) => {
            return res.status(200).send({ msg: "Successfully Fetched", data: resp.data, status: 200 });
        }).catch((err) => {
            console.log(err);
            return res.status(201).send({ msg: `Something Went Wrong` })
        });
    } catch (error) {
        console.log(error);
        return res.status(201).send({ msg: `Something Went Wrong` })
    }
}