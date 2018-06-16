'use strict';
var mongoose = require('mongoose');
  
var Schema = mongoose.Schema;



var orderSchema = new Schema({
  expectFinishTime: {
    type: Date,
    required: 'Kindly enter the expectFinishTime'
  },
  finishTime: {
    type: Date  
  },
  status: {
    type: [{
      type: String,
      enum: ['active', 'applied', 'pendingOnPay', 'paid', 'timeout', 'invalid']
    }],
    default: ['active']
  },
  carport_ID: {
    type: Schema.Types.ObjectId,
    ref: 'carports',
    required: 'Kindly enter the carport_ID'
  },
  applied_UserID: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  owner_UserID: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  //it's great to add community forein key here. It's used to make statistic of avaiable carports by community..
  community_ID: {
    type: Schema.Types.ObjectId,
    ref: 'communities'
  }, 
  basicPrice: {
    type: Number,
    required: 'Kindly enter the basicPrice'
  },
  increasedPrice: {
    type: Number,
    required: 'Kindly enter the increasedPrice'
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('order', orderSchema);