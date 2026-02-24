const express = require('express');
const route = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");

route.post("/", async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
});

module.exports = route;