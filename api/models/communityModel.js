'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 

var CommunitySchema = new Schema({
  // code: {
  //   type: String,
  //   required: 'Kindly enter the code'
  // },
  name: {
    type: String,
    required: 'Kindly enter the name'
  },
  city_ID: {
    type: Schema.Types.ObjectId,  
    // ref: 'cities',
    // required: 'Kindly enter the city_ID'
  },
  //property management company
  PMC:{
    type: String
  },
  /*pmc define price and priceUnit*/
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
  mapid: {
    type: String 
  } ,
  position: {
    type: String 
  } ,
  address: {
    type: String 
  } 
});

module.exports = mongoose.model('community', CommunitySchema);