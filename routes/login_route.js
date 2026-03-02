const express = require("express");
const router = express.Router();
const passport = require("passport");
const { redirectUrl } = require("../middleware");

// GET Login
router.get("/", (req, res) => {
  res.render("users/login");
});

// POST Login
router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  redirectUrl,   //  after authentication
  (req, res) => {
    req.flash("success", "Welcome back to StayHub!");
    res.redirect(res.locals.redirectUrl || "/listings"); // 
  }
);

module.exports = router;