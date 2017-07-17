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


router.get('/home', function (req, res) {
  Activity.find({creator: req.session.userId})
  .then(function (activity) {
    res.render('home', {displayname: req.session.displayname, activity: activity})
  })
})

router.post('/home', function(req, res) {
  if (req.body.activity) {
    const input = req.body.activity
    const newActivity = new Activity({
      name: input,
      creator: req.session.userId,
      })
      newActivity.save()
      .then(function (newActivity) {
        console.log("new activity added to db");
        res.redirect('/home');
      }).catch(function (err) {
        res.send("something went wrong", err);
        console.log(err);
      })
   } else if (req.body.deleteButton) {
     Activity.deleteOne({
       _id: req.body.deleteButton
     })
     .then( function (activity) {
        res.redirect('/home');
     })
   }
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

router.get('/activities/:id', function(req, res) {
  Activity.findById(req.params.id)
    .then(function(activity) {
      res.render('activity', {
        displayname: req.session.displayname,
        activity: activity
      })
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

router.post("/activities/:id/stats", function (req, res) {
  if (req.body.deleteStat) {
    Activity.findById(req.params.id)
    .then(function (activity) {
      var arrayOfStats = activity.data;
      var index = arrayOfStats.indexOf(req.body.deleteStat)
      if (index > -1) {
        arrayOfStats.splice(index, 1);
      }
      activity.save()
      .then(function (activity) {
        res.redirect('/activities/' + req.params.id);
      })
      .catch(function (err) {
        res.send("something went wrong", err);
      })
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
  } else {
    Activity.findById(req.params.id)
    .then(function (activity) {
      activity.data.push({
        stat: req.body.stat,
        date: req.body.date
      })
      activity.save()
      .then(function (activity) {
      res.redirect('/activities/' + req.params.id);
      })
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
  }
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
