var express = require('express');
const as = require('express-async-await');
var app = as(express());
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var engines = require('consolidate');

//-->> connect mongoose
var database = require('./config/database');
mongoose.connect(database.url, function (err, db) {
    if (err) {
        console.log(err);
    }
    console.log("connected to mongoose");
});
app.use(cors());
app.use(cookieParser());
app.use(session({secret: 'shshshshshhs',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/public/vote/dist');

app.use(express.static(__dirname + '/public/vote/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
/// exception
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

require('./controllers/routes')(app);
require('./controllers/users')(app);
require('./controllers/voting')(app);
require('./controllers/question')(app);



app.listen(3000, function () {
    console.log("Express started press ctrl-C to terminate")
});