const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema ({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  displayname: {type: String, required: true}
});

userSchema.pre('save', function(next){
  // if the password hasn't been modified we don't need to (re)hash it
  if (!this.isModified('password')) {
    return next();
  }
  var salt = bcrypt.genSaltSync(8);
  var hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
