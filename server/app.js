const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// mongoose.Promise=global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://admin:admin01@ds145574.mlab.com:45574/api_authentication', { useNewUrlParser: true })

const app = express();
app.use(cors());

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));

module.exports = app;

