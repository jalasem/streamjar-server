/* eslint-disable jsx-a11y/label-has-for */
import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import { json, urlencoded } from 'body-parser'
import userRoutes from './routes/user.routes'
import paymentRoutes from './routes/payment.routes'

dotenv.config()

// Set up the express app
const app = express()

dotenv.config()
// database config
const configDB = require('./config/db')

// set response headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token')
  next()
})

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(configDB.url, { useNewUrlParser: true }) // connect to our production database
} else if (process.env.NODE_ENV === 'test') {
  mongoose.connect(configDB.url_test, { useNewUrlParser: true }) // connect to our test database
} else {
  mongoose.connect(configDB.url, { useNewUrlParser: true })
}

// mongoose.connect(configDB.url);
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// Log requests to the console.
app.use(logger('dev'))

app.use(helmet())
  .disable('x-powered-by')
  .use(cors())

app.get('/', (req, res) => {
  res.send({ message: 'Welcome!' })
})
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(json())
app.use(urlencoded({ extended: false }))
app.use('/api/users', userRoutes)
app.use('/api/payment', paymentRoutes)

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.'
}))

module.exports = app
