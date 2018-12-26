import { isEmail } from 'validator'

export default {
  /**
   * @method signupInput
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} response
   */
  signupInput (req, res, next) {
    const {
      fullname, email, username, password
    } = req.body
    if (typeof (fullname) === 'undefined') {
      return res.status(401).json({
        message: 'fullname field must not be empty'
      })
    } if (typeof (username) === 'undefined') {
      return res.status(401).json({
        message: 'username field must not be empty'
      })
    } if (typeof (password) === 'undefined') {
      return res.status(401).send({
        message: 'Password field must not be empty'
      })
    } if (typeof (email) === 'undefined') {
      return res.status(401).send({
        message: 'Email field must not be empty'
      })
    } if (!isEmail(req.body.email)) {
      return res.status(401).send({
        message: 'Please put in a proper email address'
      })
    }
    return next()
  },
  /**
   * @method signInInput
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {*} response
   */
  signInInput (req, res, next) {
    const { email, password } = req.body
    if (typeof (email) === 'undefined') {
      return res.status(401).json({
        message: 'email field must not be empty'
      })
    } if (!isEmail(req.body.email)) {
      return res.status(401).send({
        message: 'Please put in a proper email address'
      })
    } if (typeof (password) === 'undefined') {
      return res.status(401).send({
        message: 'Password field must not be empty'
      })
    }
    return next()
  },
  forgotPasswordInput (req, res, next) {
    if (typeof (email) === 'undefined') {
      return res.status(401).send({
        message: 'Email field must not be empty'
      })
    } if (!isEmail(req.body.email)) {
      return res.status(401).send({
        message: 'Please put in a proper email address'
      })
    }
    next()
  },
  profileImage (req, res, next) {
    if (typeof req.body.image === 'undefined') {
      return res.status(401).send({
        message: 'image field must not be empty'
      })
    }
    next()
  },
  checkUserId (req, res, next) {
    const { userId } = req.params
    if (typeof (userId) === 'undefined') {
      return res.status(401).send({
        message: 'userId field must not be empty'
      })
    }
    if (typeof (parseInt(userId, 10)) !== 'number') {
      return res.status(409).send({
        message: 'userId field must be a number'
      })
    }
    next()
  }
}
