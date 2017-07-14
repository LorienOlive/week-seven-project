const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const expressValidator = require("express-validator");
const passport = require('passport');
const passportSessions = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;


const Activity = require('../models/activity');
const User = require('../models/user');

router.get('/checkauth', function(req, res) {
    res.status(200).json({
        status: 'Login successful!'
    });
});

router.get('/home', function (req, res) {
  Activity.find()
  .then(function (activity){
    console.log(activity.name)
    console.log("^^^ this is activity.name")
    res.render('home', {displayname: req.session.displayname, activity: activity.name})
  })
})

router.post('/home', function(req, res) {
//     req.checkBody('activity', 'You must enter an activity').notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
// // handle error
//     } else {

  const input = req.body.activity
  const newActivity = new Activity({
    name: input,
    creator: req.session.userId,
    })
    newActivity.save()
    .then(function (newActivity) {
      console.log("new activity added to db");
      res.redirect('/api/home');
    }).catch(function (err) {
      res.send("something went wrong", err);
      console.log(err);
    })
})


router.get('/activities', function (req, res) {
    Activity.find()
      .then(function (activity) {
        console.log("successful query to the db");
        res.json(activity);
      })
      .catch(function (err) {
        res.send("something went wrong", err);
      })
  });

// router.post('/api/activities', function (req, res) {
//   var newActivity = new Activity({
//     name: req.body.name,
//     creator: req.body.user._id,
//     data: [{
//       stat: req.body.stat,
//       date: req.body.date
//     }]
//   })
//   newActivity.save()
//     .then(function (newActivity) {
//       console.log("new activity added to db");
//       newActivity.find()
//         .populate('creator')
//         .exec(function (newActivity) {
//       res.json(newActivity.toJSON());
//       })
//     }).catch(function (err) {
//       res.send("something went wrong", err);
//     });
//   });

router.get('/activities/:id', function(req, res) {
  Activity.findById(req.params.act_id)
    .then(function(activity) {
      res.json(activity);
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
  });

router.put('/activities/:id', function (req, res) {
    Activity.findById(req.params.id)
      .then(function (activity) {
        activity.name = req.body.name;
        activity.save()
          .then(function (activity) {
            console.log("activity updated successfully")
            res.json(activity);
          })
          .catch(function (err) {
            res.send("something went wrong", err);
          })
    })
});

router.delete('/activities/:id', function (req, res) {
  Activity.remove({
    id: req.params.id
    })
    .then(function () {
      res.send("activity removed successfully")
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
});

router.post("/activities/:id/stats", function (req, res) {
  Activity.findById(req.params.id)
    .then(function (activity) {
      activity.data.push({
        stat: req.body.stat,
        date: req.body.date
      })
      activity.save()
      .then(function (activity) {
      res.json(activity);
      })
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
});

router.delete("/stats/:id", function (req, res) {
  Activity.find(req.params.id)
  .then(function (activity) {
    Activity.data.remove({date: req.body.date})
  })
  .then(function () {
    res.send("activity removed successfully")
  })
  .catch(function (err) {
    res.send("something went wrong", err);
  })
});


module.exports = router;
