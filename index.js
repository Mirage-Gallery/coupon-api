const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors')
const logger = require('./logger')

app.use(cors())

const Coupon = require('./model.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/log', (req, res) => {
  res.sendFile(__dirname + '/combined.log')
})

app.get('/coupon/:address', (req, res) => {
  // log URL
  logger.info(`GET /coupon/${req.params.address}`)
  logger.info(res.statusCode)
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
  // log URL
  logger.info(`${req.method} ${req.url}`)
  logger.info(res.statusCode)
  res.status(404).send('404: Page not found')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})