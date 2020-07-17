const mongoose = require('mongoose');
const { autoIncrementModelID } = require('../middlewares');

const receiptSchema = new mongoose.Schema(
  {
    id: { 
      type: Number, 
      unique: true
    },
    customer: {
      customerId: {
        type: String,
        required: true,
        trim: true,
      },
      customerName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountInLetters: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    branch: {
      type: String,
      trim: true,
    },
    receivedBy: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    paymentReason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    createdBy: {
      id: {
      type: String,
      required: true,
      },
      name: {
        type: String,
        required: true
      }
    },
    deletedAt: {
      type: Date || null,
      default: null,
    },
    _receipt: {},
  },
  {
    timestamps: true,
  }
);

receiptSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
});

receiptSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID('Receipt', this, next);
});
const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
