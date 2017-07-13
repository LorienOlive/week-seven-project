const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const expressValidator = require("express-validator");


const Activity = require('../models/activity');
const User = require('../models/user');

const isAuthenticated = function(req, res, next){
   if(req.user) {
     req.session.displayname = req.user.displayname
     req.session.userId = req.user._id;
     return next();
   } else {
      return res.status(401).json({
        error: 'User not authenticated'
      })
  }
}

router.get('/checkauth', isAuthenticated, function(req, res) {
    res.status(200).json({
        status: 'Login successful!'
    });
});

router.get('/api', function(req, res) {
  res.redirect('/api/signup');
})

router.get('/api/signup', function (req, res) {
  res.render('signup');
})

router.post('/api/signup', function (req, res) {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    displayname: req.body.displayname
  })
  newUser.save()
  .then(function (newUser) {
    res.json({newUser});
  })
})

router.get('/api/login', function (req, res) {
  res.render('login');
})

router.post('/api/login', function(req, res) {
  res.redirect('/api/home');
})

router.get('/api/home', isAuthenticated, function (req, res) {
  Activity.find()
  .then(function (activity){
    console.log(activity.name)
    res.render('home', {displayname: req.session.displayname, activity: activity.name})
  })
})

router.post('/api/home', isAuthenticated, function(req, res) {
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

router.get('/api/activities/:id', function(req, res) {
  Activity.findById(req.params.act_id)
    .then(function(activity) {
      res.json(activity);
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
  });

router.put('/api/activities/:id', function (req, res) {
    Activity.findById(req.params.id)
      .then(function (activity) {
        activity.name = req.body.name;
        activity.save()
          .then(function (activity) {
            console.log("activity updated successfully")
            res.json(activity.toJSON());
          })
          .catch(function (err) {
            res.send("something went wrong", err);
          })
    })
});

router.delete('/api/activities/:id', function (req, res) {
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

router.post("api/activities/:id/stats", function (req, res) {
  Activity.findById(req.params.id)
    .then(function (activity) {
      activity.data.push({
        stat: req.body.stat,
        date: req.body.date
      })
      activity.save()
      .then(function (activity) {
      res.json(activity.toJSON());
      })
    })
    .catch(function (err) {
      res.send("something went wrong", err);
    })
});

router.delete("api/stats/:id", function (req, res) {
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
