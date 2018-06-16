'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var carWasherSchema = new Schema({
  community_ID: {
    type: Schema.Types.ObjectId,
    ref: 'communities'
  },
  status: {
    type: [{
      type: String,
      enum: ['available', 'applied', 'giveback', 'timeout', 'broken']
    }],
    default: ['available']
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('carWasher', carWasherSchema);