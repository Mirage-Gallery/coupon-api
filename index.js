const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

app.use(cors())

const Coupon = require('./model.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/log', (req, res) => {
  res.sendFile(__dirname + '/access.log')
})

app.get('/coupon/member/:address', (req, res) => {
  const userAddress = req.params.address;
  Coupon.findOne({ address: userAddress, type: 'member' }, function (err, coupon) {
    if (err) console.log(err)
    if (coupon === null) {
      res.send({ error: 'No coupon found for this address' })
    }
    else {
      res.send(coupon);
    }
  });
});

app.get('/coupon/standard/:address', (req, res) => {
  const userAddress = req.params.address;
  Coupon.findOne({ address: userAddress, type: 'standard' }, function (err, coupon) {
    if (err) console.log(err)
    if (coupon === null) {
      res.send({ error: 'No coupon found for this address' })
    }
    else {
      res.send(coupon);
    }
  });
});

app.get('/coupon/braindrops/:address', (req, res) => {
  const userAddress = req.params.address;
  // find one coupon that has the address and braindrops is true
  Coupon.findOne({ address: userAddress, type: 'braindrops' }, function (err, coupon) {
    if (err) console.log(err)
    if (coupon === null) {
      res.send({ error: 'No coupon found for this address' })
    }
    else {
      res.send(coupon);
    }

  })
})
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