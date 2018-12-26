import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose

const userSchema = new Schema({
  fullname: { type: String },
  accountID: { type: Number },
  email: { type: String, required: true },
  profilePic: { type: String },
  username: { type: String, required: true, unique: true },
  bio: { type: String },
  totalEarned: { type: Number, default: 0 },
  amountUnpaid: { type: Number, default: 0 },
  referrals: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  referredBy: {
    type: Number,
    ref: 'User'
  },
  banned: { type: Boolean, default: false },
  referralEarnings: { type: Number, default: 0 },
  payPercentage: { type: Number, default: 0.8 },
  referralPercentage: { type: Number, default: 0.05 },
  isAdmin: { type: Boolean, default: false },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
})

const SALT_WORK_FACTOR = 5

userSchema.pre('save', function (next) {
  const user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

const User = mongoose.model('User', userSchema)
export default User
