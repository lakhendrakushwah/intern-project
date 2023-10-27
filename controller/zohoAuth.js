const axios = require('axios');
const ref_token = '1000.b72a6b289db438734a4da17aba5e0a17.bd1500bbb4e8ac67c676bcb8b7664b02';
const client_id = '1000.LVCYJ6BHHNW4DIJCAX95VXAMZCX0CF';
const client_secret = '65ada1380ef19fc28e3bace4f80356ad269dfd1ce2';
const orgId = '60022959159';
let access_token = '';
const HOST = process.env.HOST;
var regenerateToken = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios({
                'method': 'GET',
                'url': `https://desk.zoho.in/api/v1/departments/119381000000010772`,
                'headers': {
                    'orgId': '60022959159',
                    "Authorization": `Zoho-oauthtoken ${access_token}`
                },
            }).then(async (resp) => {
                resolve(access_token);
                return;
            }).catch(async (err) => {
                if (err.response.data.errorCode === 'UNAUTHORIZED') {
                    await axios({
                        'method': 'POST',
                        'url': `https://accounts.zoho.in/oauth/v2/token?refresh_token=${ref_token}&client_id=1000.LVCYJ6BHHNW4DIJCAX95VXAMZCX0CF&client_secret=65ada1380ef19fc28e3bace4f80356ad269dfd1ce2&scope=Desk.events.ALL,Desk.search.READ,Desk.settings.ALL,Desk.tickets.ALL,Desk.tickets.READ,Desk.tickets.UPDATE,Desk.contacts.READ,Desk.contacts.WRITE,Desk.contacts.UPDATE,Desk.contacts.CREATE&redirect_uri=http://localhost:3001/redirect&grant_type=refresh_token`,
                    }).then(async (resp) => {
                        access_token = resp.data.access_token;
                        resolve(access_token);
                        return;
                    }).catch((err) => {
                        console.log(err);
                        reject();
                    });
                }
            });
        } catch (error) {
            console.log(error);
            reject();
        }
    })
}

var getAuthrized = async () => {
    try {
        await axios({
            'method': 'POST',
            'url': `https://accounts.zoho.in/oauth/v2/token?code=1000.ee8438a88119d9e13b00e6576a9e9087.eaea3a8fd494b422275afecffdccd9aa&grant_type=authorization_code&client_id=1000.LVCYJ6BHHNW4DIJCAX95VXAMZCX0CF&client_secret=65ada1380ef19fc28e3bace4f80356ad269dfd1ce2&redirect_uri=http://localhost:3001/redirect`,
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

// regenerateToken();
// getAuthrized();
exports.regenerateToken = regenerateToken;
