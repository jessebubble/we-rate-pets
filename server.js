// dependencies 
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection.js');
const path = require('path');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });
const session = require('express-session');
const bcrypt = require('bcrypt'); // need to call this somewhere...will research modules

const app = express(); // creates express application
const PORT = process.env.PORT || 3001; // selects port 3001 for production environment Heroku

// middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views' )); troubleshooting mysql error

// connects session to Sequelize database (reference module 14.2.5)
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {}, // do we setup cookie logout after period of no activity
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess)); // connects session to Sequelize database (reference module 14.2.5)

app.use(routes); //turn on routes

sequelize.sync({ force: false }).then(() => { // turn on connection to database and server (reference module 13.1.6)
    app.listen(PORT, () => console.log('Now Listening'));
});