'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var carWasherOrderSchema = new Schema({
    applied_UserID: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    applied_time: { type: Date },
    giveback_time: { type: Date },
    carwasher_ID: {
        type: Schema.Types.ObjectId,
        ref: 'carwashers'
    },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('carWasherOrder', carWasherOrderSchema);