/* eslint-disable jsx-a11y/label-has-for */
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

import User from '../models/User'
// import paymentService from './payment.service'
import errorService from './error.service'
import { createToken, createAccountID, fetchUserIdFromAccId } from '../utils/helperMethods'

mongoose.Promise = global.Promise
dotenv.config()

const { handleServerError, handleServerResponse } = errorService

export default {
  async NumRefferals (id) {
    const data = await User.findById(id).exec()
    if (data.length) {
      return data.length
    } else {
      return 0
    }
  },
  async emailInUse (email) {
    const isEmail = await User.findOne({
      email
    }).exec()
    if (isEmail) {
      return true
    }
    return false
  },
  async register (req, res) {
    try {
      const {
        fullname, username, password, email, profilePic, bio
      } = req.body
      let { referredBy } = req.body

      // const isEmail = await this.emailInUse(email)
      const isEmail = await User.findOne({
        email
      }).exec()

      if (isEmail) {
        return handleServerResponse(res, 409, { success: true, message: 'email already in use' })
      }

      if (referredBy) {
        let userReferral = await fetchUserIdFromAccId(referredBy)
        console.log(JSON.stringify(userReferral, null, 2))
        if (!userReferral) {
          referredBy = 0
        }
      } else {
        referredBy = 0
      }

      let accountID = await createAccountID()

      const user = new User({
        email,
        fullname,
        accountID,
        username,
        profilePic,
        referredBy,
        bio,
        password
        // add other detils below
      })
      const newUser = await user.save()
      // create new payment info here
      const token = createToken(newUser._id, newUser.fullname)
      return handleServerResponse(res, 201, { success: true, message: `Welcome ${newUser.fullname}`, token })
    } catch (error) {
      handleServerError(res, error)
    }
  },
  async loginUser (req, res) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({
        email
      })
      if (!user) {
        return handleServerResponse(res, 404, { success: false, message: 'Email does not exist' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return handleServerResponse(res, 401, {
          message: 'Incorrect Password'
        })
      }
      return res.status(202).send({
        success: true,
        token: createToken(user._id, user.fullname),
        message: `Welcome back ${user.fullname}`
      })
    } catch (error) {
      return handleServerError(res, error)
    }
  },
  async getOneUser (req, res) {
    const { userId } = req.params
    try {
      const user = await User.findById(userId).select('-password').exec()
      if (!user) {
        return handleServerResponse(res, 404, { success: true, message: 'User id provided in params is incorrect' })
      }
      if (user.banned) {
        return handleServerResponse(res, 401, { success: true, message: 'user has been banned' })
      }
      return handleServerResponse(res, 200, { success: true, user })
    } catch (error) {
      return handleServerError(res, error)
    }
  },
  async getAllUsers (req, res) {
    const { limit, offest } = req.query
    try {
      const users = User.find({ isAdmin: false })
        .select('-password')
        .limit(limit || 10)
        .skip(offest || 0)
      handleServerResponse(res, 200, { success: true, users })
    } catch (error) {
      return handleServerError(res, error)
    }
  },
  async updateUser (req, res) {
    const { userId } = req.params
    const {
      fullname, email, profilePic, bio
    } = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(userId,
        { fullname, email, profilePic, bio },
        { new: true }).exec()
      return handleServerResponse(res, 200, { success: true, message: 'user details updated successfully', updatedUser })
    } catch (error) {
      return handleServerError(res, error)
    }
  },
  async loginAdminUser (req, res) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({
        email,
        isAdmin: true
      })
      if (!user) {
        return handleServerResponse(res, 404, { success: false, message: 'Email does not exist' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return handleServerResponse(res, 401, {
          message: 'Incorrect Password'
        })
      }
      return res.status(202).send({
        success: true,
        token: createToken(user._id, user.fullname),
        message: `Welcome back ${user.fullname}`
      })
    } catch (error) {
      return handleServerError(res, error)
    }
  }
}
