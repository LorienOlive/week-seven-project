const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');


const statSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  date: {type: new Date(), required: true},
  name: {type: String, required: true},
  stat: {type: Number, required: true},
  user_id: {type: Number, required: true},
  activity_id: {type: Number, required: true}
})

const Stat = mongoose.model('Stat', statSchema);

module.exports = Stat;
