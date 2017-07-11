const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema ({
  id: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  //if the password hasn't been modified we don't need to rehash it //
  if (!this.isModified('password')) {
    return next();
  }
  var hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  next();
})

module.exports = User;
