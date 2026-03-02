require("dotenv").config();

const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const Review = require("./models/review");

// ================= DATABASE =================

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Atlas!"))
  .catch((err) => console.log(err));

// ================= VIEW ENGINE =================

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ================= SESSION STORE =================

// 
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL MIDDLEWARE =================

app.use((req, res, next) => {
  res.locals.success = req.flash("success")[0] || null;
  res.locals.error = req.flash("error")[0] || null;
  res.locals.curruser = req.user;
  next();
});

// ================= ROUTES =================

const listings = require("./routes/listings");
const reviews = require("./routes/review");
const userRoute = require("./routes/user");
const login = require("./routes/login_route");

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/signup", userRoute);
app.use("/login", login);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are successfully logged out");
    res.redirect("/listings");
  });
});

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.log("===== ERROR START =====");
  console.log(err);
  console.log("===== ERROR END =====");

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something Went Wrong!";

  res.status(statusCode).render("error", { message });
});

// ================= SERVER =================

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});