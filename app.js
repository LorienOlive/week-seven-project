const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/activities');

// const hash = bcrypt.hashSync(user.password, 8);
// const base64encodedData = new Buffer(user + ':' + password).toString('base64');

const index = require('./routes/index');
const users1 = require('./routes/users1');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users1', users1);

// const users = {
//     'clinton': 'test'
// };

// Create a child Schema for each stat //
const statSchema = new mongoose.Schema({
  date: Date,
  stat: Number,
})

// Create a child Schema for each activity //
const activitySchema = new mongoose.Schema({
  name: String,
  stats: [statSchema]
});

// Create a parent Schema for each user //
const userSchema = new mongoose.Schema ({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  activity: [activitySchema]
});

const User = mongoose.model('User', userSchema);

// Create a new instance of User //
const user = new User({
  username: "Meatwad",
  password: "squishy",
  activity: [{
    name: "TV Watching",
    stats: {
      date: new Date(),
      stat: 5}
    }]
});
  user.save()
    .then(function () {
      console.log("new user saved to db");
    }).catch( function () {
      console.log("there was a problem saving the new user");
    })

// passport.use(new BasicStrategy(
//   function(username, password, done) {
//       const userPassword = user[username];
//       if (!userPassword) { return done(null, false); }
//       if (userPassword !== password) { return done(null, false); }
//       return done(null, username);
//   }
// ));
//
// const base64encodedData = new Buffer(user.username + ':' + user.password).toString('base64');
//
// // put routes here
//
// app.get('/api/hello',
//     passport.authenticate('basic', {session: false}),
//     function (req, res) {
//         res.json({"hello": req.user})
//     }
// );

app.get('/api/activities', function (req, res) {
  User.find({}).then(function (user) {
  res.json(user);
  })
});

app.listen(3000, function(){
  console.log("Successfully started express application!")
});

module.exports = app;
