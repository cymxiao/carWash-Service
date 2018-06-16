'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 

var xjMemberSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name'
  },
  birthday: {
    type: String,
    required: 'Kindly enter the birthday'
  },
  cellPhone: {
    type: Number,  
     
  }, 
  email:{
    type: String,
  },
  address: {
    type: String 
  }, 
  timestamp: { type: Date, default: Date.now },
  status: {
    type: [{
      type: String,
      enum: ['active', 'blocked', 'deleted']
    }],
    default: ['active']
  }
});

module.exports = mongoose.model('xjMembers', xjMemberSchema);