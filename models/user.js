const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema ({
  displayname: {type: String, required: true}
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
