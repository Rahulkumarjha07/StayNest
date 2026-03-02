const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,

  image: {
    url: String,
    filename: String,
  },

  location: String,
  country: String,

  // 🔥 GEOJSON (Mapbox needs this)
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// 🔥 Cascade delete reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);