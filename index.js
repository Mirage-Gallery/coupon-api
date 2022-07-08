const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;

const Coupon = require('./model.js')

app.get('/coupon/:address', (req, res) => {
    const userAddress = req.params.address;
    Coupon.findOne({address: userAddress}, function(err, coupon) {
      if (err) throw err;
      res.send(coupon);
    });
  });

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})