import mongoose from 'mongoose'
const { Schema } = mongoose

const lastIDSchema = Schema({
  lastId: { type: Number, required: true }
})

const lastID = mongoose.model('LastId', lastIDSchema)
export default lastID
