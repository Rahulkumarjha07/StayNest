const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/", (req, res) => {
  res.render("users/signup");
});

router.post("/", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);

   req.login(registeredUser, (err) => {
  if (err) return next(err);

  req.flash("success", "Welcome to WanderLust!");

  const redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;

  return res.redirect(redirectUrl);
});

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

module.exports = router;