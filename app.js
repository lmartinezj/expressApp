var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var events = require('events');
const { param } = require('./routes');
const cors = require('cors')
const http = require('http');
const { nextTick } = require('process');
const fetch = require('node-fetch');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(express.json())
app.use(express.urlencoded({
    extended: true  
}))

app.use(express.static(path.join(__dirname, 'public')));

var whitelist = ['https://d4d905567409.ngrok.io', 'http://localhost:3000']

app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        res.status((200).json({}));
    }
    next();
});
  
app.get('/tokens', function(req, res) {
    res.render('layout', { title: 'Create Token'});
    res.end();
});

app.post('/payments', cors(), function (req, res) {
    res.render('payments', { 
        title: 'Create Payment',
        amount: req.body.amount,
        currency: req.body.currency,
        description: req.body.statement_soft_descriptor
    });
});

/*
app.post('/createPayment', cors(corsOptions), function (req, res) {
    console.log(req.body);
    console.log(req.headers);
    
    const options = {
        hostname: 'api.paymentsos.com',
        port: 443,
        path: '/payments',
        method: 'POST',
        amount: 4097,
        currency: "EUR",
        billing_address: {
            phone: "+1-541-754-3010"
        },
        order: {
            id: "myorderid"
        },
        headers: {
          'Content-Type': 'application/json',
          'api-version': '1.3.0',
          'x-payments-os-env': 'test',
          'app-id': 'co.Anthara.testbusinessunit',
          'private-key': '60055ba6-92ad-4a5a-8fec-e64e6d2d208c',
          'Access-Control-Allow-Origin': 'http://localhost:3000, https://d4d905567409.ngrok.io',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
          'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, private-key, idempotency-key, Authorization',
          'idempotency-key': 'cust-'+ Math.floor(Math.random() * 1000) + '-payment'
        }
    }

    const request = http.request(options, res => {
        console.log('statusCode: ${res.statusCode}')
        res.on('data', d => {
            console.error(error)
        })
        request.end()
    })
});
*/

module.exports = app;