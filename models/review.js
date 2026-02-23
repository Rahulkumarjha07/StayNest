const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
    required: [true, "Rating is required"]
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;