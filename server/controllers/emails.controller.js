const Email = require('email-templates');
var config = require('config.json');
var express = require('express');
var router = express.Router();

const I18N = require('@ladjs/i18n');
const phrases = { 'HELLO': 'Hello there!' };
const i18n = new I18N({ phrases });
 
// routes
router.post("/sendEmail", sendEmail)
 
module.exports = router;

function sendEmail(req, res) {
    console.log(req.body);
    const email = new Email({
        message: {
            from: ''
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: {
            jsonTransport: true
        },
        i18n: {}
    });

    email
        .send({
            template: req.body.template + '/html',
            message: {
                to: req.body.to || req.body.Email
            },
            locals: {
                locale: 'fr',
                name: req.body.name || req.body.ContactPerson,
            }
        })
        .then(email => {
            console.log(email);
            res.status(200).json(email);
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json(err);
            
        });

}
