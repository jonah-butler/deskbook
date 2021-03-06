const AuthenticationController = require('../controllers/AuthenticationController.js');
const helpers = require('../assets/helpers/helpers.js');
const User = require('../models/user.js');
const passport = require('passport');
const express = require('express');

module.exports = (app) => {
  app.get("/login",
  AuthenticationController.loginIndex);

  app.post("/login",
    passport.authenticate('local', {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  app.get("/forgot",
    AuthenticationController.forgotIndex);

  app.post("/forgot-email",
    AuthenticationController.forgot);

  app.get("/reset/:token",
    AuthenticationController.tokenIndex);

  app.post("/reset/:token",
    AuthenticationController.tokenPost);
}
