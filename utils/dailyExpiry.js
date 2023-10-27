const sch = require("node-schedule");
const aws = require("aws-sdk");
const daily_q = process.env.DAILY_Q;
const monthly_q = process.env.MONTHLY_Q;
const aws_config = {
    apiVersion: "2012-11-05",
    accessKeyId: process.env.AWS_accessKeyId_campaign,
    secretAccessKey: process.env.AWS_secretAccessKey_campaign,
    region: process.env.SQS_region,
};
aws.config.update(aws_config);
var sqs = new aws.SQS({ apiVersion: "2012-11-05" });
const stripe = require('stripe')(`${process.env.STRIPE_SECRET}`);

var daliy_q_start = async () => {
    try {
        const time = process.env.daily_q_time;
        const id = process.env.DAILY_Q_ID;
        var job = sch.scheduleJob(id, time, async () => {
            
            // await stripe.invoices.create({
            //     customer: us.customerId,
            //     due_date: unixTimestampTomorrow.toString(),
            //     collection_method: 'send_invoice',
            //     metadata: {
            //         ticket_id: ticket_id,
            //         payment_id: pay.id
            //     },
            //     currency: mp.currency
            // }).then(async (invoice) => {
            //     await stripe.invoiceItems.create({
            //         customer: us.customerId,
            //         invoice: invoice.id,
            //         currency: mp.currency,
            //         description: mp.name,
            //         unit_amount_decimal: currentMonthAmount(mp.pricePerUnit) * 100,
            //         quantity: noOfLicences,
            //         tax_rates: ['txr_1Nfh2ESInG6niEqMHe6qhrh1']
            //     }).then(async () => {
            //         await stripe.invoices.finalizeInvoice(
            //             invoice.id
            //         ).then(async (invo) => {

            //         })
            //     })
            // })
        });
        return;
    } catch (err) {
        console.log(err);
        return;
    }
}

var monthly_q_start = async () => {
    try {
        const time = process.env.daily_q_time;
        const id = process.env.DAILY_Q_ID;
        var job = sch.scheduleJob(id, time, async () => {
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

                    })
                })
            })
        });
        return;
    } catch (err) {
        console.log(err);
        return;
    }
}