const express = require("express");
const app = express();

const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const Review  = require("./models/review");

// DB
mongoose.connect("mongodb://127.0.0.1:27017/wanderlast")
  .then(() => console.log("Connected!"));

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// INDEX
app.get("/listings", async (req, res) => {
  const allistings = await Listing.find({});
  res.render("listing/index", { allistings });
});

// NEW
app.get("/listings/new", (req, res) => {
  res.render("listing/newform");
});

// CREATE
app.post("/listings", async (req, res,next) => {
  try{
     const listing = new Listing(req.body.listing);
  await listing.save();
  res.redirect("/listings");
  }
  catch{
    next(err);
  }
});

// SHOW
app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  res.render("listing/show", { listing });
});

// EDIT
app.get("/listings/:id/edit", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listing/edit", { listing });
});

// UPDATE
app.put("/listings/:id", async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  res.redirect(`/listings/${req.params.id}`);
});

// DELETE
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
});

///reviews
//review post route

// Review POST Route
app.post("/listings/:id/reviews", async (req, res) => {

  const listing = await Listing.findById(req.params.id) .populate("reviews");

  const newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log(newReview);

 res.redirect(`/listings/${listing._id}`);

});


app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
