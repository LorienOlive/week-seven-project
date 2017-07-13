const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express')
const passport = require('passport');
const passportSessions = require('passport-session');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/activities');

const routes = require('./routes/routes');
const Activity = require('./models/activity');
const User = require('./models/user');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({
  secret: 'no touch monkey',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user){
      if (user && bcrypt.compareSync(password, user.password)){
        return done(null, user);
      }
      return done(null, false);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
  console.log("user serialized");
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function(err, user) {
      console.log('user deserialized');
      done(err, user);
    })
});

app.use(passport.authenticate('basic', {session: true}));

app.use('/', routes);

app.listen(2000, function(){
  console.log("Successfully started express application!")
});

module.exports = app;
