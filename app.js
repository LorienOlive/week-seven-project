const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/activities');

// const hash = bcrypt.hashSync(user.password, 8);
// const base64encodedData = new Buffer(user + ':' + password).toString('base64');

const routes = require('./routes/routes');
const Activity = require('./models/activitySchema');
const User = require('./models/userSchema');
const Stat = require('./models/statSchema');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne( {username: username }), function (err, user) {
      if (user && bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
      }
    }
  ));

app.use(passport.authenticate('basic', {session: false}));

app.get('/api/auth', function(req, res) {
  res.send('you have been authenticated, ' + req.user.name);
});

app.listen(2000, function(){
  console.log("Successfully started express application!")
});

module.exports = app;
