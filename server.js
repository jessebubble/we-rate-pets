const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');

const sequelize = require('./config/connection.js');

const app = express();
const PORT = process.env.PORT || 3001;
