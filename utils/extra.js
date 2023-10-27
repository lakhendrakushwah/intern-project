const db = require("../models");
const { regenerateToken } = require('../controller/zohoAuth')

var update = async () => {
    try {
        await db.marketPlaceProduct.update({
            interval: "Yearly"
        }, {
            where: {
                id: [10,11,12,28,29,30,33,34,37,38]
            }
        }).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {

    }
}
// update();
var create = async () => {
    try {
        await db.marketPlaceProduct.create({
            name: "Microsoft 365 Family",
            description: "For one to six people to share. Each person can use on up to five devices simultaneously. Works on PC, Mac, iPhone, iPad and Android phones and tablets. Up to 6 TB of cloud storage (1 TB per person). Additional features in the Family Safety mobile app.",
            interval: "Monthly",
            pricePerUnit: 570,
            marketPricePerUnit: 619,
            specialMarketPrice: 619,
            specialEasePrice: 570,
            marketplaceId: 38,
            type: "For Buissness"
        }).then(async (data) => {
            await db.marketPlaceProduct.create({
                name: "Microsoft 365 Personal",
                description: "For one person. Use up to five devices simultaneously. Works on PC, Mac, iPhone, iPad and Android phones and tablets. 1 TB of cloud storage.",
                interval: "Monthly",
                pricePerUnit: 419,
                marketPricePerUnit: 489,
                specialMarketPrice: 489,
                specialEasePrice: 419,
                marketplaceId: 38,
                type: "For Home"
            }).then(async (data) => {
                await db.marketPlaceProduct.create({
                    name: "Microsoft 365 Family",
                    description: "For one to six people to share. Each person can use on up to five devices simultaneously. Works on PC, Mac, iPhone, iPad and Android phones and tablets. Up to 6 TB of cloud storage (1 TB per person). Additional features in the Family Safety mobile app.",
                    interval: "Yearly",
                    pricePerUnit: 5700,
                    marketPricePerUnit: 6199,
                    specialMarketPrice: 6199,
                    specialEasePrice: 5700,
                    marketplaceId: 38,
                    type: "For Home"
                }).then(async (data) => {
                    await db.marketPlaceProduct.create({
                        name: "Microsoft 365 Personal",
                        description: "For one person. Use up to five devices simultaneously. Works on PC, Mac, iPhone, iPad and Android phones and tablets. 1 TB of cloud storage.",
                        interval: "Yearly",
                        pricePerUnit: 4190,
                        marketPricePerUnit: 4899,
                        specialMarketPrice: 4899,
                        specialEasePrice: 4190,
                        marketplaceId: 38,
                        type: "For Home"
                    }).then((data) => {
                        console.log(data);
                    }).catch((err) => {
                        console.log(err);
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {

    }
}

const axios = require('axios');
var customerCreateZoho = async () => {
    try {
        await axios({
            'method': 'POST',
            'url': `https://desk.zoho.in/api/v1/contacts`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": "Zoho-oauthtoken 1000.877f9b4a24da11e2179b1ba99ea0bf39.634ab7584b6148e31694b3ca48042ad4"
            },
            'data': {
                "lastName": "Jack",
                "firstName": "hugh",
                "email": "jack@zylker.com"
            }
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var ticketCreateZoho = async () => {
    try {
        await axios({
            'method': 'POST',
            'url': `https://desk.zoho.in/api/v1/tickets`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": "Zoho-oauthtoken 1000.877f9b4a24da11e2179b1ba99ea0bf39.634ab7584b6148e31694b3ca48042ad4"
            },
            'data': {
                "contactId": "119381000000193001",
                "subject": "Buissness R Google Workspace Buy",
                "dueDate": "2023-08-12T16:16:16.000Z",
                "departmentId": "119381000000195029",
                "channel": "Email",
                "description": "This is Description",
                "language": "English",
                "priority": "High",
                "classification": "",
                "assigneeId": "119381000000064001",
                "phone": "1 888 900 9646",
                "category": "general",
                "email": "kaustubh@easenode.com",
                "status": "Open"
            }
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var departmentCreateZoho = async () => {
    try {
        await axios({
            'method': 'POST',
            'url': `https://desk.zoho.in/api/v1/departments`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": "Zoho-oauthtoken 1000.877f9b4a24da11e2179b1ba99ea0bf39.634ab7584b6148e31694b3ca48042ad4"
            },
            'data': {
                "isVisibleInCustomerPortal": true,
                "name": "easenodePayments",
                "description": "With the most advanced technology, the easenode is the world’s largest selling platform.",
                "associatedAgentIds": ["119381000000176001", "119381000000064001", "119381000000176037"],
                "nameInCustomerPortal": "zPhone"
            }
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var getAuthrized = async () => {
    try {
        await axios({
            'method': 'POST',
            'url': `https://accounts.zoho.in/oauth/v2/token?code=1000.c165b292d80535d8b6dc957b7d5f6f9a.a8c284ffc366f338c581852df8c8f613&grant_type=authorization_code&client_id=1000.LVCYJ6BHHNW4DIJCAX95VXAMZCX0CF&client_secret=65ada1380ef19fc28e3bace4f80356ad269dfd1ce2&redirect_uri=http://localhost:3001/redirect`,
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var listAgenst = async () => {
    try {
        await axios({
            'method': 'GET',
            'url': `https://desk.zoho.in/api/v1/agents`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": "Zoho-oauthtoken 1000.877f9b4a24da11e2179b1ba99ea0bf39.634ab7584b6148e31694b3ca48042ad4"
            },
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var listTickets = async () => {
    try {
        await axios({
            'method': 'GET',
            'url': `https://desk.zoho.in/api/v1/tickets`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": "Zoho-oauthtoken 1000.c9dca8d8512209758e33afb6afe7550f.26a4a4c29b52d77d75b7912ef17c640b"
            },
        }).then(async (resp) => {
            let res = [];
            for (let i = 0; i < resp.data.data.length; i++) {
                const ele = resp.data.data[i];
                if (ele.contactId === "119381000000193001") {
                    console.log(ele);
                    res.push(ele);
                }
            }
            console.log("Updated Sequence", res);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var listThreads = async () => {
    try {
        await axios({
            'method': 'GET',
            'url': `https://desk.zoho.in/api/v1/tickets/119381000000208001/threads`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": "Zoho-oauthtoken 1000.82ac1b8006360de3c103461dd0760d3e.214aee7d8fa81894792d9f89785d7fe2"
            },
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}

var listDepartments = async () => {
    try {
        let access_token = await regenerateToken();
        console.log("listDepartments", access_token);
        await axios({
            'method': 'GET',
            'url': `https://desk.zoho.in/api/v1/channels`,
            'headers': {
                'orgId': '60022959159',
                "Authorization": `Zoho-oauthtoken ${access_token}`
            },
        }).then(async (resp) => {
            console.log("Updated Sequence", resp.data);
        }).catch((err) => {
            console.log(err.response.data);
        });
    } catch (error) {
        console.log(error);
    }
}

// var regenerateToken = async () => {
//     try {
//         await axios({
//             'method': 'POST',
//             'url': `https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.c36372df86f2a6ace4bac47ab8760241.acddfc6887d6816a4986a7fc76c7c1f2&client_id=1000.LVCYJ6BHHNW4DIJCAX95VXAMZCX0CF&client_secret=65ada1380ef19fc28e3bace4f80356ad269dfd1ce2&scope=Desk.tickets.ALL,Desk.contacts.READ,Desk.contacts.WRITE,Desk.contacts.UPDATE,Desk.contacts.CREATE&redirect_uri=http://localhost:3001/redirect&grant_type=refresh_token`,
//             'headers': {
//                 'orgId': '60022959159',
//                 "Authorization": "Zoho-oauthtoken 1000.877f9b4a24da11e2179b1ba99ea0bf39.634ab7584b6148e31694b3ca48042ad4"
//             },
//             'data': {
//                 "lastName": "Jack",
//                 "firstName": "hugh",
//                 "email": "jack@zylker.com"
//             }
//         }).then(async (resp) => {
//             console.log("Updated Sequence", resp.data);
//         }).catch((err) => {
//             console.log(err);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

var redirect = async (req, res) => {
    console.log(req.params);
    return res.status(200).send(req.params);
}

// 119381000000208001
exports.redirect = redirect;
// getAuthrized()
// groupCreateZoho();
// ticketCreateZoho()
// listAgenst();
// listTickets();
// listThreads();
// listDepartments();
// regenerateToken();
// departmentCreateZoho();
// update();
// create();

// 1000.82f5376df3882da2d6fbd7d64e2e637b.0406196dcf915c9f19b2fdaf28efc4ae
// ref - 1000.c36372df86f2a6ace4bac47ab8760241.acddfc6887d6816a4986a7fc76c7c1f2
// acc - 1000.c9dca8d8512209758e33afb6afe7550f.26a4a4c29b52d77d75b7912ef17c640b
// cid - 1000.LVCYJ6BHHNW4DIJCAX95VXAMZCX0CF
// sid - 65ada1380ef19fc28e3bace4f80356ad269dfd1ce2
// scopes - Desk.tickets.ALL,Desk.contacts.READ,Desk.contacts.WRITE,Desk.contacts.UPDATE,Desk.contacts.CREATE

// Updated Sequence customer{
//     layoutId: '119381000000011346',
//     firstName: 'hugh',
//     lastName: 'Jack',
//     facebook: null,
//     twitter: null,
//     accountCount: '0',
//     email: 'jack@zylker.com',
//     secondaryEmail: null,
//     mobile: null,
//     phone: null,
//     city: null,
//     country: null,
//     state: null,
//     street: null,
//     zip: null,
//     description: null,
//     title: null,
//     type: null,
//     createdTime: '2023-08-03T06:13:20.000Z',
//     modifiedTime: '2023-08-03T06:13:20.000Z',
//     ownerId: '119381000000176001',
//     accountId: null,
//     customFields: {},
//     cf: {},
//     layoutDetails: { id: '119381000000011346', layoutName: 'Easenode' },
//     zohoCRMContact: null,
//     id: '119381000000193001',
//     photoURL: null,
//     customerHappiness: { badPercentage: '0', okPercentage: '0', goodPercentage: '0' },
//     webUrl: 'https://desk.zoho.in/support/easenode/ShowHomePage.do#Contacts/dv/119381000000193001',
//     isSpam: false,
//     isTrashed: false,
//     isAnonymous: false,
//     isDeleted: false,
//     isEndUser: false,
//     isFollowing: false
//   }

//   Updated Sequence agents{
//     data: [
//       {
//         zuid: '60020686935',
//         emailId: 'kaustubh@easenode.com',
//         isConfirmed: true,
//         status: 'ACTIVE',
//         roleId: '119381000000012324',
//         profileId: '119381000000012339',
//         firstName: 'Kaustubh',
//         lastName: 'Rai',
//         phone: '',
//         mobile: '',
//         aboutInfo: '',
//         extn: '',
//         countryCode: 'en_US',
//         photoURL: 'https://deskstatic.zoho.in/api/v1/agents/119381000000176001/photo?orgId=60022959159',
//         rolePermissionType: 'Admin',
//         associatedChatDepartmentIds: [],
//         associatedDepartmentIds: [Array],
//         name: 'Kaustubh Rai',
//         timeZone: 'Asia/Kolkata',
//         id: '119381000000176001',
//         channelExpert: [],
//         langCode: 'en_US'
//       },
//       {
//         zuid: '60018240723',
//         emailId: 'lakhendra@easenode.com',
//         isConfirmed: true,
//         status: 'ACTIVE',
//         roleId: '119381000000012324',
//         profileId: '119381000000012339',
//         firstName: 'LAKHENDRA',
//         lastName: 'KUSHWAH',
//         phone: '',
//         mobile: '',
//         aboutInfo: '',
//         extn: '',
//         countryCode: 'en_IN',
//         photoURL: 'https://deskstatic.zoho.in/api/v1/agents/119381000000064001/photo?orgId=60022959159',
//         rolePermissionType: 'Custom',
//         associatedChatDepartmentIds: [Array],
//         associatedDepartmentIds: [Array],
//         name: 'LAKHENDRA KUSHWAH',
//         timeZone: 'Asia/Kolkata',
//         id: '119381000000064001',
//         channelExpert: [],
//         langCode: 'en_IN'
//       },
//       {
//         zuid: '60020685720',
//         emailId: 'mahendra@easenode.com',
//         isConfirmed: true,
//         status: 'ACTIVE',
//         roleId: '119381000000012324',
//         profileId: '119381000000012339',
//         firstName: 'Mahendra',
//         lastName: 'Kushwah',
//         phone: '',
//         mobile: '',
//         aboutInfo: '',
//         extn: '',
//         countryCode: 'en_US',
//         photoURL: 'https://deskstatic.zoho.in/api/v1/agents/119381000000176037/photo?orgId=60022959159',
//         rolePermissionType: 'Admin',
//         associatedChatDepartmentIds: [],
//         associatedDepartmentIds: [Array],
//         name: 'Mahendra Kushwah',
//         timeZone: 'Asia/Kolkata',
//         id: '119381000000176037',
//         channelExpert: [],
//         langCode: 'en_US'
//       }
//     ]
//   }



// Updated Sequence department {
//     id: '119381000000195029',
//     name: 'easenodePayments',
//     description: 'With the most advanced technology, the easenode is the world’s largest selling platform.',
//     createdTime: '2023-08-03T06:32:21.966Z',
//     associatedAgentIds: [ '119381000000064001', '119381000000176001', '119381000000176037' ],
//     creatorId: '119381000000176001',
//     nameInCustomerPortal: 'zPhone',
//     hasLogo: false,
//     chatStatus: 'NOT_CREATED',
//     isAssignToTeamEnabled: true,
//     isVisibleInCustomerPortal: true,
//     isDefault: false,
//     sanitizedName: 'easenodepayments',
//     isEnabled: true
//   }

// Updated Sequence ticket {
//     modifiedTime: '2023-08-03T06:50:18.000Z',
//     subCategory: 'Sub General',
//     statusType: 'Open',
//     subject: 'Buissness R Google Workspace',
//     dueDate: '2023-08-03T12:50:18.000Z',
//     departmentId: '119381000000195029',
//     channel: 'Email',
//     onholdTime: null,
//     language: 'English',
//     source: {
//       appName: null,
//       extId: null,
//       permalink: null,
//       type: 'SYSTEM',
//       appPhotoURL: null
//     },
//     resolution: null,
//     sharedDepartments: [],
//     closedTime: null,
//     approvalCount: '0',
//     isOverDue: false,
//     isTrashed: false,
//     createdTime: '2023-08-03T06:50:18.000Z',
//     id: '119381000000203001',
//     isResponseOverdue: false,
//     customerResponseTime: '2023-08-03T06:50:18.000Z',
//     productId: null,
//     contactId: '119381000000193001',
//     threadCount: '1',
//     secondaryContacts: [],
//     priority: 'High',
//     classification: null,
//     commentCount: '0',
//     taskCount: '0',
//     accountId: null,
//     phone: '1 888 900 9646',
//     webUrl: 'https://desk.zoho.in/support/easenode/ShowHomePage.do#Cases/dv/119381000000203001',
//     isSpam: false,
//     status: 'Open',
//     entitySkills: [],
//     ticketNumber: '103',
//     customFields: {},
//     isArchived: false,
//     description: 'This is Description',
//     timeEntryCount: '0',
//     channelRelatedInfo: null,
//     responseDueDate: null,
//     isDeleted: false,
//     modifiedBy: '119381000000176001',
//     email: 'rkush214@gmail.com',
//     layoutDetails: { id: '119381000000200314', layoutName: 'easenodePayments' },
//     channelCode: null,
//     cf: {},
//     slaId: '119381000000196451',
//     layoutId: '119381000000200314',
//     assigneeId: '119381000000064001',
//     teamId: null,
//     attachmentCount: '0',
//     isEscalated: false,
//     category: 'general'
//   }


//department
// {
//     data: [
//         {
//             id: '119381000000010772',
//             name: 'Easenode',
//             description: null,
//             createdTime: '2023-07-31T12:34:25.000Z',
//             hasLogo: false,
//             creatorId: '119381000000064001',
//             nameInCustomerPortal: 'Easenode',
//             chatStatus: 'AVAILABLE',
//             isVisibleInCustomerPortal: true,
//             isAssignToTeamEnabled: true,
//             sanitizedName: 'easenode',
//             isEnabled: true,
//             isDefault: true
//         },
//         {
//             id: '119381000000195029',
//             name: 'easenodePayments',
//             description: 'With the most advanced technology, the easenode is the world’s largest selling platform.',
//             createdTime: '2023-08-03T06:32:22.000Z',
//             hasLogo: false,
//             creatorId: '119381000000176001',
//             nameInCustomerPortal: 'zPhone',
//             chatStatus: 'NOT_CREATED',
//             isVisibleInCustomerPortal: true,
//             isAssignToTeamEnabled: true,
//             sanitizedName: 'easenodepayments',
//             isEnabled: true,
//             isDefault: false
//         }
//     ]
// }



// {
//     'Business Plus N': [
//         {
//             canReply: true,
//             contentType: 'text/html',
//             status: 'SUCCESS',
//             summary: 'Thank you for reaching out to us. We appreciate your inquiry and value your business. We are committed to providing exceptional customer service and will do our best to assist you ...',
//             author: [Object],
//             attachmentCount: '0',
//             sentiment: null,
//             channelRelatedInfo: null,
//             respondedIn: null,
//             lastRatingIconURL: null,
//             readReceipts: null,
//             impersonatedUser: null,
//             visibility: 'public',
//             createdTime: '2023-08-05T13:29:37.000Z',
//             direction: 'in',
//             actions: [],
//             id: '119381000000229156',
//             channel: 'WEB',
//             hasAttach: false,
//             aspects: null,
//             source: [Object],
//             isDescriptionThread: true,
//             keyWords: null
//         }
//     ],
//         'Business Starter N': [
//             {
//                 canReply: true,
//                 contentType: 'text/html',
//                 status: 'SUCCESS',
//                 summary: 'Thank you for reaching out to us. We appreciate your inquiry and value your business. We are committed to providing exceptional customer service and will do our best to assist you ...',
//                 author: [Object],
//                 attachmentCount: '0',
//                 sentiment: null,
//                 channelRelatedInfo: null,
//                 respondedIn: null,
//                 lastRatingIconURL: null,
//                 readReceipts: null,
//                 impersonatedUser: null,
//                 actions: [],
//                 visibility: 'public',
//                 direction: 'in',
//                 createdTime: '2023-08-05T12:53:06.000Z',
//                 id: '119381000000233074',
//                 channel: 'WEB',
//                 hasAttach: false,
//                 aspects: null,
//                 source: [Object],
//                 keyWords: null,
//                 isDescriptionThread: true
//             }
//         ]
// }