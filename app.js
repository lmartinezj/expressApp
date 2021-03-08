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

module.exports = app;