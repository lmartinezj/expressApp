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
const { response } = require('express');
if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config() 
}
var cookieParser = require('cookie-parser')

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(express.json())
app.use(express.urlencoded({
    extended: true  
}))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));


app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        console.log("OPTIONS CALLED")
        res.status((200).json({}));
    }
    next();
});
  
app.get('/', (req, res) => {
    res.render('layout', { title: 'Create Token'});
});

app.post('/payments', async (req, res, next) => {
    console.log("token: " + req.cookies.token); 
    
    const url = process.env.PAYMENTS_URL;
    const idempotencyKey = "cust-" + Math.floor(Math.random() * 1000) + "-payment";
    
    var myHeaders = new fetch.Headers();
    myHeaders.append("app_id", process.env.APP_ID);
    myHeaders.append("private_key", process.env.PRIVATE_KEY);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-version", process.env.API_VERSION);
    myHeaders.append("x-payments-os-env", process.env.X_PAYMENTS_OS_ENV);
    myHeaders.append("idempotency_key", idempotencyKey);

    var raw = {
        "amount": req.body.amount,
        "currency":req.body.currency,
        "billing_address":req.body.billing_address,
        "statement_soft_descriptor": req.body.statement_soft_descriptor,
        "order":{
            "id":"myorderid"
        }
    };

    var paymentRequest = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    }

    await fetch(url, paymentRequest)
    .then(response => {
        if (response.ok) {
            console.log("SUCCESS from paymentOS")
            return response.json()
        } else {
            console.log("FAILURE from paymentOS")
        }
    })
    .then(data => {
        res.render('payments', { 
            title: 'Authorize Payment',
            amount: data.amount,
            currency: data.currency,
            description: data.statement_soft_descriptor,
            payment_id: data.id
        })
    })
    .catch(error => console.log("Error app.js: " + error.message))
});

app.post('/payments/:paymentid/authorizations', async (req, res, next) => {
    console.log("token: " + req.cookies.token); 
    
    const url = process.env.PAYMENTS_URL + "/" + req.params.paymentid + "/authorizations";
    console.log("paymentOS url: " + url)
    const idempotencyKey = "cust-" + Math.floor(Math.random() * 1000) + "-payment";
    
    var myHeaders = new fetch.Headers();
    myHeaders.append("app_id", process.env.APP_ID);
    myHeaders.append("private_key", process.env.PRIVATE_KEY);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-version", process.env.API_VERSION);
    myHeaders.append("x-payments-os-env", process.env.X_PAYMENTS_OS_ENV);
    myHeaders.append("idempotency_key", idempotencyKey);

    var raw = {
        "payment_method": {
            "token":req.cookies.token,
            "type":"tokenized",
            "credit_card_cvv":req.cookies.encrypted_cvv
        },
        "reconciliation_id":"23434534534"
    };

    var authorizationRequest = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    }

    await fetch(url, authorizationRequest)
    .then(response => {
        if (response.ok) {
            console.log("SUCCESS from paymentOS")
            return response.json()
        } else {
            console.log("FAILURE from paymentOS")
        }
    })
    .then(data => {
        console.debug(data)  
        //res.send(data)      
        res.render('authorizations', { 
            title: 'Capture Payment',
            amount: data.amount,
            currency: data.currency,
            description: data.statement_soft_descriptor,
            payment_id: req.params.paymentid,
            authorization_id: data.id
        })
    })
    .catch(error => console.log("Error app.js: " + error.message))
});

app.post('/payments/:paymentid/captures', async (req, res, next) => {
    console.log("token: " + req.cookies.token); 
    
    const url = process.env.PAYMENTS_URL + "/" + req.params.paymentid + "/captures";
    console.log("paymentOS url: " + url)
    const idempotencyKey = "cust-" + Math.floor(Math.random() * 1000) + "-payment";
    
    var myHeaders = new fetch.Headers();
    myHeaders.append("app_id", process.env.APP_ID);
    myHeaders.append("private_key", process.env.PRIVATE_KEY);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-version", process.env.API_VERSION);
    myHeaders.append("x-payments-os-env", process.env.X_PAYMENTS_OS_ENV);
    myHeaders.append("idempotency_key", idempotencyKey);

    var captureRequest = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    }

    await fetch(url, captureRequest)
    .then(response => {
        if (response.ok) {
            console.log("SUCCESS from paymentOS")
            return response.json()
        } else {
            console.log("FAILURE from paymentOS")
        }
    })
    .then(data => {
        console.debug(data)  
        //res.send(data)      
        res.render('captures', { 
            title: 'Refund Payment',
            amount: data.amount,
            currency: data.currency,
            description: data.statement_soft_descriptor,
            payment_id: req.params.paymentid,
            capture_id: data.id
        })
    })
    .catch(error => console.log("Error app.js: " + error.message))
});

app.post('/payments/:paymentid/refunds', async (req, res, next) => {
    console.log("token: " + req.cookies.token); 
    
    const url = process.env.PAYMENTS_URL + "/" + req.params.paymentid + "/refunds";
    console.log("paymentOS url: " + url)
    const idempotencyKey = "cust-" + Math.floor(Math.random() * 1000) + "-payment";
    
    var myHeaders = new fetch.Headers();
    myHeaders.append("app_id", process.env.APP_ID);
    myHeaders.append("private_key", process.env.PRIVATE_KEY);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-version", process.env.API_VERSION);
    myHeaders.append("x-payments-os-env", process.env.X_PAYMENTS_OS_ENV);
    myHeaders.append("idempotency_key", idempotencyKey);

    var refundRequest = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    }

    await fetch(url, refundRequest)
    .then(response => {
        if (response.ok) {
            console.log("SUCCESS from paymentOS")
            return response.json()
        } else {
            console.log("FAILURE from paymentOS")
        }
    })
    .then(data => {
        console.debug(data)  
        res.render('refunds', { 
            title: 'Refund Payment Completed',
            amount: data.amount,
            currency: data.currency,
            description: data.statement_soft_descriptor,
            payment_id: req.params.paymentid,
            refund_id: data.id
        })
    })
    .catch(error => console.log("Error app.js: " + error.message))
});


module.exports = app;