var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const counterSchema = new Schema(
  {
  _id: {type: String, required: true},
  seq: { type: Number, default: 600 }
  }
);

counterSchema.index({ _id: 600, seq: 1 }, { unique: true })

const counterModel = mongoose.model('counter', counterSchema);

const autoIncrementModelID = function (modelName, doc, next) {
  counterModel.findByIdAndUpdate(        // ** Method call begins **
    modelName,                           // The ID to find for in counters model
    { $inc: { seq: 1 } },                // The update
    { new: true, upsert: true },         // The options
    function(error, counter) {           // The callback
      console.log(counter, 'counter')
      if(error) return next(error);

      doc.id = counter.seq;
      next();
    }
  );                                     // ** Method call ends **
}

module.exports = { autoIncrementModelID };
