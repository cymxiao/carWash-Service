'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 

var UserSchema = new Schema({
  username: {
    type: String,
    required: 'Kindly enter the username'
  },
  password: {
    type: String,
    required: 'Kindly enter the password'
  },
  community_ID: {
    type: Schema.Types.ObjectId,  
    ref: 'communities' 
  },
  account_ID: {
    type: Schema.Types.ObjectId,  
    ref: 'accounts' 
  },
  role: {
    type: [{
      type: String,
      enum: ['PMCUser','superAdministator', 'externalUser']
    }],
    default:['externalUser']
  },
  phoneNo: {
    type: String 
  },
  address: {
    type: String 
  },
  name: {
    type: String
  },
  carPlate: {
    type: String
  },
  lastLoginDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: [{
      type: String,
      enum: ['pendingOnVerify','active', 'blocked', 'deleted']
    }],
    default: ['active']
  }
});

module.exports = mongoose.model('users', UserSchema);