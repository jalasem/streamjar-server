import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  url: 'mongodb+srv://hello:htLYPMVmWJ7XLiu@streamjar-t1zbx.mongodb.net/test?retryWrites=true',
  url_production: process.env.MONGODB_URI,
  url_test: process.env.DB_URL
}

// htLYPMVmWJ7XLiu
