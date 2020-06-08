const mongoose = require('mongoose')

const receiptSchema = new mongoose.Schema ({
  customerId: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  amountInLetters: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  branch:{
      type: String,
      trim: true
    },
  receivedBy:{
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    required: true
  },
  paymentReason: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date || null,
    default: null
  },
  _receipt:{}
}, {
  timestamps: true
})

receiptSchema.methods.toJSON = function () {
  const receipt = this
  const receiptObject = receipt.toObject()

  if(receiptObject.deletedAt === null) {
    delete receiptObject.deletedAt
  }

  return receiptObject
}
const Receipt = mongoose.model('Receipt', receiptSchema)

module.exports = Receipt 