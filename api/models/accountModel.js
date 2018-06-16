'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 

var AccountSchema = new Schema({
  credit: {
    type: Number, 
  }, 
  //Another solution is: add account_ID column to user table, then use populate to display account info
  //However, regarding to old user those don't have account_id, it would throw an error.
  user_ID: {
    type: Schema.Types.ObjectId,  
    ref: 'users' 
  }, 
  timestamp: { type: Date, default: Date.now },
  obsoleteTime: { type: Date },
  status: {
    type: [{
      type: String,
      enum: ['active', 'deleted']
    }],
    default: ['active']
  }
});

module.exports = mongoose.model('accounts', AccountSchema);