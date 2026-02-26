const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: {
    url: String
  },
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"   // ✅ MUST BE CAPITAL R
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"      // ✅ MUST BE CAPITAL U
  }
});

// 🔥 Cascade delete
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);