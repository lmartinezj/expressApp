var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var events = require('events');
const { param } = require('./routes');
const cors = require('cors')
const http = require('http');
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
  
app.get('/', function(req, res) {
    res.render('layout', { title: 'Create Token'});
    res.end();
});

app.post('/payments', function (req, res) {
    
    const url = "https://api.paymentsos.com/payments";
    const idempotencyKey = "cust-" + Math.floor(Math.random() * 1000) + "-payment";
    
    var myHeaders = new fetch.Headers();
    myHeaders.append("app-id", "co.Anthara.testbusinessunit");
    myHeaders.append("private-key", "60055ba6-92ad-4a5a-8fec-e64e6d2d208c");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-version", "1.3.0");
    myHeaders.append("x-payments-os-env", "test");
    myHeaders.append("idempotency_key", idempotencyKey);

    var raw = JSON.stringify({
        "amount": req.body.amount,
        "currency":req.body.currency,
        "billing_address":req.body.billing_address,
        "order":{
            "id":"myorderid"
        }
    });
    
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    /*
    var data = fetch(url, requestOptions)
    .then(function(response){
        return response.text();
    })
    .catch(error => console.log('error', error)) 

    console.log(data)
    */
    
    fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))    

    //console.log(data);

    /*
    res.render('payments', { 
        title: 'Create Payment',
        amount: req.body.amount,
        currency: req.body.currency,
        description: req.body.statement_soft_descriptor
        //payment_id: JSON.stringify(result['id'])
    })       
    */
});

module.exports = app;