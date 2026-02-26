const mongoose = require('mongoose');

let initDb = require("./data.js");

mongoose.connect('mongodb://127.0.0.1:27017/wanderlast')
  .then(() => console.log('Connected!'));

const Listing = require('../models/listing.js');

const initDB = async () => {
  await Listing.deleteMany({});
  initDb.data = initDb.data.map((obj)=>({...obj,owner:'696685123aebcadea7756a5d'}));
  await Listing.insertMany(initDb.data);
  console.log("Database Initialized with sample data");
}

initDB();