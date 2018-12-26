import mongoose from 'mongoose'
const { Schema } = mongoose

const PaymentInfoSchema = Schema({
  owner: { type: String, ref: 'User' },
  fullname: { type: String, required: true },
  paymentMethod: { type: String, default: 'PayPal' },
  paymentInfo: String
})

const PaymentInfo = mongoose.model('PaymentInfo', PaymentInfoSchema)
export default PaymentInfo
