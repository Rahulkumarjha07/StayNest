const express = require("express");
const app = express();
const session = require("express-session");
const flash = require('connect-flash');


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

//sessionoptions

const sessionoption = {
  secret:"mysecretcodekey",
    resave: false,
    saveUninitialized: false,
    cookie:{
      expires:Date.now() + 7 *60 *60 *24 *1000,
      maxAge:1000* 60 *60 *24 *3,
      httpOnly:true
    },

};

app.use(session(sessionoption));
app.use(flash());



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const listings = require("./routes/listings.js");

const reviews = require("./routes/review.js");

const userRoute = require("./routes/user.js");

const login = require("./routes/login_route.js");

const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");



//passport

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use local strategy
passport.use(new localstrategy(user.authenticate()));

// Serialize user
passport.serializeUser(user.serializeUser());

// Deserialize user
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  const success = req.flash("success");
  const error = req.flash("error");

  res.locals.success = success.length > 0 ? success[0] : null;
  res.locals.error = error.length > 0 ? error[0] : null;
  res.locals.curruser = req.user;

  next();
});





app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/signup",userRoute);

app.use("/login",login);

app.get("/logout",(req,res,next)=>{
   req.logout((err) => {
    if(err){
       return next(err);
    }
    req.flash("success","you are succesfully logged out");
    res.redirect("/listings");
   });
});







// INDEX
 /* app.get("/listings", async (req, res) => {
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

*/


app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
