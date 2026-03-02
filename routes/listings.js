const express = require("express");
const route = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");

const multer = require("multer");
const { storage, cloudinary } = require("../cloudconfig");
const upload = multer({ storage });

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAPBOX_TOKEN
});


// ================= INDEX =================
// ================= INDEX =================
route.get("/", async (req, res) => {

  let { destination, checkin, checkout, guests } = req.query;

  let filter = {};

  // Destination filtering
  if (destination) {
    filter.location = { $regex: destination, $options: "i" };
  }

  // (Optional future logic for availability using checkin/checkout)

  const allistings = await Listing.find(filter);

  res.render("listing/index", { allistings });
});


// ================= NEW =================
route.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/newform");
});


// ================= CREATE =================
route.post("/", isLoggedIn, upload.single("listing[image]"), async (req, res, next) => {
  try {

    const geoData = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send();

    const listing = new Listing(req.body.listing);
    listing.owner = req.user;

    listing.geometry = geoData.body.features[0].geometry;

    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };

    await listing.save();

    req.flash("success", "Listing Created Successfully!");
    res.redirect("/listings");

  } catch (err) {
    next(err);
  }
});


// ================= SHOW =================
route.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("reviews")
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listing/show", {
    listing,
    curruser: req.user,
    mapToken: process.env.MAPBOX_TOKEN
  });
});


// ================= EDIT =================
route.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listing/edit", { listing });
});


// ================= UPDATE =================
route.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), async (req, res) => {

  let listing = await Listing.findById(req.params.id);

  Object.assign(listing, req.body.listing);

  // Re-geocode if location changed
  if (req.body.listing.location) {
    const geoData = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send();

    listing.geometry = geoData.body.features[0].geometry;
  }

  if (req.file) {
    await cloudinary.uploader.destroy(listing.image.filename);

    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${listing._id}`);
});


// ================= DELETE =================
route.delete("/:id", isLoggedIn, isOwner, async (req, res) => {

  const listing = await Listing.findById(req.params.id);

  await cloudinary.uploader.destroy(listing.image.filename);
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
});

module.exports = route;