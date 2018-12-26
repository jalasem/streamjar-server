/* eslint-disable jsx-a11y/label-has-for */
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import Users from '../models/User'
import LastId from '../models/lastID'
// import axios from 'axios'
// import errorService from '../services/error.service'

// const { handleServerResponse } = errorService

export const getOffer = async (req, res) => {
  // let { username, ip } = req.body
  // const offers = await axios.get()
}

/**
   * createToken
   * @param {Number} id user id gotten from database
   * @param {String} username username of logged user
   * @description creates new jwt token for authentication
   * @returns {String} newly created jwt
   */
export const createToken = (id, username, obj) => {
  const token = jwt.sign({
    id,
    username,
    obj
  },
  process.env.SECRET)
  return token
}

/**
 * createAccountID
 * @description Generate AccountID for users based on last accountID
 * @returns {String}
 */
export const createAccountID = async () => {
  // const lastId = 999 // for seeding
  const lastId = await LastId.findOne().exec()
  const newLastId = new LastId({ lastId: Number(lastId) + 1 })
  const newId = await newLastId.save()
  return newId.lastId
}

/**
 * fetchUserIdFromAccId
 * @param {*} accId
 * @returns {Object}
 */
export const fetchUserIdFromAccId = async (accId) => {
  let user = await Users.findOne({ accountID: accId }).exec()
  return user
}

/**
   * @method hasToken
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {Object} response object
   */
export const hasToken = (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: err
        })
      }
      req.decoded = decoded
      return next()
    })
  } else {
    return res.status(403).send({
      message: 'You have to be loggedin first'
    })
  }
}

export const isAdmin = async (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: err
        })
      }
      const user = await Users.findById(decoded.id)
      if (!user) {
        res.status(403).send({
          success: false,
          message: 'user not found'
        })
      }
      if (!user.isAdmin) {
        res.status(403).send({
          success: true,
          message: 'you need admin access to perform this action'
        })
      }
      next()
    })
  } else {
    return res.status(403).send({
      message: 'You have to be loggedin first'
    })
  }
}

export const isUser = async (req, res, next) => {
  const { userId } = req.params
  const user = await Users.findById(userId)
  if (user) {
    return next()
  }
  return res.status(404).send({
    success: false,
    message: `User with id ${userId} not found`
  })
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
const s3 = new AWS.S3()
export const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'stream-jar',
    acl: 'public-read',
    metadata (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})
