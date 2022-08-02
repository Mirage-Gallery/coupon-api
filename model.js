const mongoose = require('mongoose');
require('dotenv').config();
const dbURL = process.env.DB_URL;

mongoose.connect(dbURL, { useNewUrlParser: true });

const couponSchema = new mongoose.Schema({
  r: String,
  s: String,
  v: Number,
  address: String,
  type: String,
}, {
  collection: 'coupons'
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

