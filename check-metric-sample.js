"use strict";

var ATHelper = require('./lib/at-api-helper.js');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'florian.atinternet@gmail.com',
        pass: 'password'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Florian Rieupet <florian.atinternet@gmail.com>', // sender address
    to: 'florian.rieupet@atinternet.com', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Error detected', // plaintext body
    html: 'Hello<br> An anormal amount of error pages has been detected on the website.' // html body
};

// Query parameters
var queryParameters = {
    "login": "login_atinternet@domain.com",
    "password": "password_AT_Internet",
    "url": "https://apirest.atinternet-solutions.com/data/v2/html/getData?&columns={m_page_loads}&sort={-m_page_loads}" +
    "&filter={d_page:{$eq:'404_error'}}&space={s:554331}&period={R:{D:'0'}}&max-results=50&page-num=1"
};

ATHelper.getScalarValue(queryParameters)
    .then(function (result) {

        var threshold = 10;

        //compare with threshold
        if (result >= threshold) {
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
            return console.log(error);
            }
    console.log('Message sent: ' + info.response);

});
        }
        else {
            console.log("Threshold NOT reached -> actual value : %s (threshold value : %s)", result, threshold);
        }

    })
    .catch(function (error) {
        console.log("An error has occurred : %s", error.message);
    });
