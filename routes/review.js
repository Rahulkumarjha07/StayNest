const express = require('express');
const route = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");

const { isLoggedIn, isReviewAuthor } = require("../middleware");

route.post("/", async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const newReview = new Review(req.body.review);

  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

 req.flash("success","Review Created Succesfully");
  res.redirect(`/listings/${listing._id}`);
});

route.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  }
);
module.exports = route;