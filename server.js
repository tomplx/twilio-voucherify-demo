const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const request = require('request');
const voucherifyClient = require('voucherify');

const apiVerifications = {
    twilio: {
        appId: 'your-twilio-app-id',
        apiKey: 'your-twilio-api-key'
    },
    voucherify: {
        appId: 'your-voucherify-app-id',
        apiKey: 'your-voucherify-api-key'
    }
}
const twilioClient = require('twilio')(apiVerifications.twilio.appId, apiVerifications.twilio.apiKey);
const verifiedVoucherifyClient = voucherifyClient({
    applicationId: apiVerifications.voucherify.appId,
    clientSecretKey: apiVerifications.voucherify.apiKey
})

app.use(express.static(path.join(__dirname, 'build')));
app.use('*', cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/customers', (req, res) => {
    verifiedVoucherifyClient.customers.list()
        .then(result => {
            return result.customers.map((customer, i) => {
                return {
                    vid: customer.id,
                    id: i,
                    name: customer.name,
                    email: customer.email,
                    phoneNumber: customer.phoneNumber
                }
            })
        })
        .then(result => {
            res.send(JSON.stringify(
                result
            ));
        });
});

app.get('/campaigns', (req, res) => {
    verifiedVoucherifyClient.campaigns.list()
        .then(result => {
            return result.campaigns.filter(campaign => typeof campaign.vouchers_count !== 'undefined')
        })
        .then(result => {
            res.send(JSON.stringify(result));
        });
});

app.post('/send-vouchers', (req, res) => {
    const reqCampaignName = req.body.campaignName;
    const reqCustomersList = req.body.customers;

    request({
        uri: 'https://api.voucherify.io/v1/publications',
        method: 'POST',
        headers: {
            'X-App-Id': apiVerifications.voucherify.appId,
            'X-App-Token': apiVerifications.voucherify.apiKey,
            'Content-Type': 'application/json'
        },
        json: {
            campaign: {
                name: reqCampaignName,
                count: reqCustomersList.length
            },
            customer: {
                source_id: 'test',
                email: 'test@test.com',
                name: 'Test customer'
            }
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const vouchers = body.vouchers;

          reqCustomersList.forEach((customer, index) => {
            setTimeout(() => {
                twilioClient.messages.create({
                    from: 'whatsapp:+14155238886',
                    body: `Hi, this is your coupon! ${vouchers[index]}`,
                    to: `whatsapp:${customer.userPhone}`
                })
                    .then(message => console.log(message, message.sid));
            }, 100);
        });
        }
      });

    res.send(JSON.stringify({'Status': 'OK'}));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(process.env.PORT || 8080);
console.log('Listening to http://localhost:8080\nRemember to build your app to serve it on 8080 port on production!');