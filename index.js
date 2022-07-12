const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors')

app.use(cors())

const Coupon = require('./model.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/coupon/:address', (req, res) => {
  console.log(res.statusCode)

  const userAddress = req.params.address;
  Coupon.findOne({ address: userAddress }, function (err, coupon) {
    if (err) console.log(err)
    if (coupon === null) {
      res.send({ error: 'No coupon found for this address' })
    }
    else {
      res.send(coupon);
    }
  });
});

// route for sending a .txt file at path ./coupon.txt
app.get('/loaderio-5c062010c267d966c18fdb3c4a118112', (req, res) => {
  res.sendFile(__dirname + '/stress.txt');
})

// catch all 404
app.use((req, res, next) => {
  res.status(404).send('404: Page not found')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})