const mongoose = require('mongoose');
const { autoIncrementModelID } = require('../middlewares');

const receiptSchema = new mongoose.Schema(
  {
    _id: { 
      type: Number, 
      unique: true
    },
    customer: {
      _id: false,
      id: {
        type: String,
        required: true,
        trim: true,
      },
      name: {
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
      _id: false,
      id: {
        type: String,
        required: true
      },
      name:  {
        type: String,
        trim: true,
        required: true
      }
    },
    receivedBy: {
      _id: false,
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      }
    },
    paymentType: {
      _id: false,
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      }
    },
    paymentReason: {
      _id: false,
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      }
    },
    details: {
      type: String,
    },
    createdBy: {
      _id: false,
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
