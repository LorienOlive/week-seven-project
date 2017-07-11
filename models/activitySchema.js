const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');

const activitySchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  user_id: {type: Number, required: true}
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
