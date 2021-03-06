const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const passportLocalMongoose = require('passport-local-mongoose');

const activitySchema = new mongoose.Schema({
  name: {type: String, required: true},
  creator: String,
  data: [{
    stat: {type: Number},
    date: String
  }]
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
