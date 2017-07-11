const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Activity = require('../models/activitySchema');
const User = require('../models/userSchema');
const Stat = require('../models/statSchema');

router.get('/api/activities', function (req, res) {
    Activity.find()
      .then(function (activity) {
        console.log("successful query to the db");
        res.json(activity);
      })
      .catch(function (err) {
        res.send("something went wrong", err);
      })
});

router.post('/api/activities', function (req, res) {
    var newActivity = new Activity({
        id: req.body.id,
        name: req.body.name,
        user_id: req.body.user_id
    })
    newActivity.save()
      .then(function (newActivity) {
        console.log("new activity added to db")
        res.status(201).json(newActivity.toJSON());
      }).catch(function (err) {
          res.send("something went wrong", err);
      });
  });

const getActivity = (function (req, res, next) {
    var id = req.params.id;
    Activity.findById(id)
      .then(function(activity) {
        req.activity = activity;
        next();
      })
      .catch(function (err) {
        res.send("something went wrong", err);
      })
  })

router.get('/api/activities/:id', getActivity, function(req, res) {
    res.json(req.activity.toJSON());
  });

router.put('/api/activities/:id', getActivity, function (req, res) {
    const activity = req.activity;
    activity.name = req.body.name;
    activity.save()
    .then(function () {
      console.log("activity updated successfully")
      res.json(activity.toJSON);
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
});

router.delete('/api/activities/:id', getActivity, function (req, res) {
    activity.remove({
      id: req.params.id
    })
    .then(function () {
      res.send("activity removed successfully")
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
});

router.post("api/activities/:id/stats", getActivity, function (req, res) {
  activity.stat = req.body.stat;
  activity.stat = req.body.date;
  activity.save()
    .then(function () {
      res.json(activity.toJSON);
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
});

router.delete("api/stats/:id", function (req, res) {
  stat.findById(id)
  .then(function (stat) {
    Stat.remove(stat)
  })
  .then(function () {
    res.send("activity removed successfully")
  })
  .catch(function (err) {
    res.send("something went wrong", err);
  })
});


module.exports = router;
