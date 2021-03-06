const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./router');
const port = process.env.PORT;
const mongodb = process.env.MONGODB_URI;

//connect to MongoDB
mongoose.connect(mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("MongoDB connected")
});

//use sessions for tracking logins
app.use(session({
  secret: 'cytellix',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(__dirname));
app.use('/', routes);

// catch 404
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(port, function () {
})