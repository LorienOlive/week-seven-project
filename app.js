const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportSessions = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;

const routes = require('./routes/routes');
const index = require('./routes/index');
const Activity = require('./models/activity');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

app.use('/', routes);
app.use('/', index);

passport.use(new LocalStrategy(User.authenticate()));

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("user was authenticated")
      return next()
    }
    res.redirect('/login')
  }
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
  console.log(user.username + ' serialized');
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function (err, user) {
    if (err) { return done(err); }
    console.log(user.username + ' deserialized');
    done(null, user);
  });
});

mongoose.connect('mongodb://localhost:27017/activities');

app.listen(3000, function(){
  console.log("Successfully started express application!")
});

module.exports = app;
