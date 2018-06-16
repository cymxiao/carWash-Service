'use strict';
var mongoose = require('mongoose');
// var moment = require('moment');
// var moment = require('moment-timezone');
// var zone = 'Asia/Shanghai';
// var dtNow = moment(Date.now()).tz(zone).format();
//moment().tz("Asia/Shanghai").format();
//moment().tz()
var Schema = mongoose.Schema;



var leisureParkSchema = new Schema({
  startTime: {
    type: Date,
    required: 'Kindly enter the startTime'
  },
  endTime: {
    type: Date,
    required: 'Kindly enter the endTime'
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
  shared_UserID: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  //it's great to add community forein key here. It's used to make statistic of avaiable carports by community..
  community_ID: {
    type: Schema.Types.ObjectId,
    ref: 'communities'
  },
  priceUnit: {
    type: [{
      type: String,
      enum: ['小时', '天', '月']
    }],
    default: ['天']
  },
  price: {
    type: Number,
    required: 'Kindly enter the price'
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('leisurePark', leisureParkSchema);