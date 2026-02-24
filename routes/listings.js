const express = require('express');
const route = express.Router();
const Listing = require("../models/listing");

// INDEX
route.get("/", async (req, res) => {
  const allistings = await Listing.find({});
  res.render("listing/index", { allistings });
});

// NEW
route.get("/new", (req, res) => {
  res.render("listing/newform");
});

// CREATE
route.post("/", async (req, res, next) => {
  try {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

// SHOW
route.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  res.render("listing/show", { listing });
});

// EDIT
route.get("/:id/edit", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listing/edit", { listing });
});

// UPDATE
route.put("/:id", async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  res.redirect(`/listings/${req.params.id}`);
});

// DELETE
route.delete("/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
});

module.exports = route;