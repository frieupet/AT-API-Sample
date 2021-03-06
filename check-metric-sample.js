"use strict";
 
var ATHelper = require('./lib/at-api-helper.js');
var nodemailer = require('nodemailer');

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
    "login": "user@atinternet.com",
    "password": "xxxxxx",
    "url": "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={m_visits}&sort={-m_visits}" +
    "&filter={d_geo_country:{$eq:'Allemagne'}}&space={s:429023}&period={R:{D:'0'}}&max-results=50&page-num=1"
};
 
 
//The variable minutes give the delay between each call 
var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my check");
ATHelper.getScalarValue(queryParameters)
    .then(function (result) {
 
        // threshold to reach
        var threshold = 500;
 
        //compare with threshold
        if (result >= threshold) {
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: '+ info.response);
            });
        }
        else {
            console.log("Threshold NOT reached -> actual value : %s (threshold value : %s)", result, threshold);
        }
 
    })
    .catch(function (error) {
        console.log("An error has occurred : %s", error.message);
    });
    }, the_interval); 
