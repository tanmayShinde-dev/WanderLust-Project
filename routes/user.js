const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserContoller = require("../controllers/user.js");




router.route("/signup")
.get( UserContoller.renderSignUpForm)
.post( UserContoller.signUp);


router.route("/login")
.get( UserContoller.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true, }), UserContoller.login);


router.get("/logout", UserContoller.logOut);

// router.get("/signup", UserContoller.renderSignUpForm);

// router.get("/login", UserContoller.renderLoginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true, }), UserContoller.login);

// router.post("/signup", UserContoller.signUp);


module.exports = router;