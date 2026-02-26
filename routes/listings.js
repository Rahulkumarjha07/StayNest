const express = require('express');
const route = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn,isOwner } = require("../middleware.js");

// INDEX
route.get("/", async (req, res) => {
  const allistings = await Listing.find({});
  res.render("listing/index", { allistings });
});

// NEW
route.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/newform");
});

// CREATE
route.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user;
    await listing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

// SHOW
route.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listing/show", { listing });
});

// EDIT
route.get("/:id/edit", isLoggedIn,isOwner, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listing/edit", { listing });
});

// UPDATE
route.put("/:id", isLoggedIn, isOwner, async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${req.params.id}`);
});

// DELETE
route.delete("/:id", isLoggedIn,isOwner, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
});



module.exports = route;