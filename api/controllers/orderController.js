'use strict';


var mongoose = require('mongoose'),
  //Carport = mongoose.model('carport'),
  cp = require('../models/carportModel'),
  u = require('../models/userModel'),
  Carport = mongoose.model('carport', cp.schema),
  //com = require('../models/communityModel'),
  User = require('../models/userModel',u.schema),
  //Community = mongoose.model('community', com.schema),
  order = mongoose.model('order');
 
//   var moment = require('moment');
// var moment = require('moment-timezone');
// var zone = 'Asia/Shanghai';
// var dtNow = moment(Date.now()).tz(zone).format();

  
exports.list_all_orders = function (req, res) {
  order.find({}, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  });
};

exports.testTime = function (req, res) {
   //res.json({mtime: dtNow , mtime2: moment(), mTime3: moment(new Date()), jsTime: new Date(), jsTime2: Date.now()});
   res.json({  jsTime: new Date(), jsTime2: Date.now() , jsTime3: Date.now });
};

exports.list_orders_for_Owner = function (req, res) { 
  order.find({ shared_UserID : req.params.ownerId ,  endTime: {"$gte": new Date() }}, null, {sort: { timestamp: -1 }}, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  }).populate([{path:'carport_ID', model : Carport }]);
  //.sort({ timestamp : 1}) 
  //}).populate('carport_ID');
};

exports.checkStartTime = function (req, res) { 
  //console.log( req.params.startTime );
  order.findOne({  community_ID : req.params.comId, status : 'active', shared_UserID : req.params.ownerId , carport_ID: req.params.cpId, startTime : {"$lte": req.params.startTime} , endTime: {"$gte": req.params.startTime }}, null, {sort: { timestamp: -1 }}, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  }); 
};

exports.checkEndTime = function (req, res) { 
  //console.log( req.params.endTime );
  order.findOne({  community_ID : req.params.comId, status : 'active', shared_UserID : req.params.ownerId , carport_ID: req.params.cpId,  endTime: {"$gte": req.params.endTime }}, null, {sort: { timestamp: -1 }}, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  }); 
};

exports.getStartTimeforNext = function (req, res) { 
  order.findOne({  community_ID : req.params.comId, status : 'active', shared_UserID : req.params.ownerId , carport_ID: req.params.cpId }, null, {sort: { timestamp: -1 }}, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  }); 
};



exports.list_orders_for_Applier = function (req, res) { 
  order.find({ applied_UserID : req.params.applierId}, null, {sort: { timestamp: -1 }}, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  }).populate([{path:'carport_ID', model : Carport }]);
  //.sort({ timestamp : 1}) 
  //}).populate('carport_ID');
};


exports.list_orders_by_Community = function (req, res) {
  //if 000000000000000000000000, it would list all the share order of the community
  //Amin:Tocheck It used for PMC dashboard, so applied_UserID should be defined or emtpy. it's not null or undefined.
  if (req.params.ownerId === '000000000000000000000000') {
    order.find({
      community_ID: req.params.comId, 
      // status: { "$ne": 'invalid' },
      endTime: { "$gte": new Date() }
      //order by date ascending
    }, null, { sort: { timestamp: 1 } }, function (err, order) {
      if (err)
        res.send(err);
      res.json(order);
    }).populate([{ path: 'carport_ID', model: Carport }])
      .populate([{ path: 'shared_UserID', model: User }])
      .populate([{ path: 'applied_UserID', model: User }]);
  } else { 
    order.find({
      community_ID: req.params.comId, status: 'active',
      shared_UserID: { "$ne": req.params.ownerId }, endTime: { "$gte": new Date() }
    }, null, { sort: { timestamp: -1 } }, function (err, order) {
      if (err)
        res.send(err);
      res.json(order);
    }).populate([{ path: 'carport_ID', model: Carport }]).populate([{ path: 'shared_UserID', model: User }]);
  }
};



exports.groupCountbyCommunity = function (req, res) {
  //Amin:tocheck  status is a array column, it seems works in aggregate
  var rules = [{ priceUnit: '天' } ,{status : 'active'}]; //, {price: {$gte: 200}} 
  order.aggregate([
    {
      //Amin !IMP:  startTime : { $lte : new Date(Date.now())} , I should use new Date(...) here, otherwise it would return empty query result. 
      //$match: { $and: rules  , price : { $gt : 0}} 
      //$match: { startTime : { $lt : Date.now().toLocaleString()} }
      $match: {  $and: rules  ,  endTime: {"$gte": new Date(Date.now()) }}
    },
    {
      $group: {
        _id: '$community_ID',  //$region is the column name in collection
        count: { $sum: 1 }
      }
    },
    {
      "$lookup": {
        "from": "communities",
        "localField": "_id",
        "foreignField": "_id",
        "as": "community_info"
      }
    }
  ], function (err, result) {
    if (err) {
      next(err);
    } else {
      res.json(result);
    }
  });//.populate([{path:'_id', model : Community }]);
};


exports.read_a_order = function (req, res) {
  order.findById(req.params.taskId, function (err, order) {
    if (err)
      res.send(err);
    res.json(order);
  });
};

exports.create_a_order = function (req, res) {

  var chunk = '', data;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () {

    data = JSON.parse(chunk);
    var new_order = new order(data);
    new_order.save(function (err, order) {
      if (err)
        res.send(err);
      res.json(order);
    });
  });
}


exports.update_a_order = function (req, res) {

  var chunk = '', data;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () {

    data = JSON.parse(chunk);
    order.findOneAndUpdate({ _id: req.params.orderId }, data, { new: true }, function (err, order) {
      if (err)
        res.send(err);
      res.json(order);
    });
  });
};


exports.delete_a_order = function (req, res) {
  order.remove({
    _id: req.params.taskId
  }, function (err, order) {
    if (err)
      res.send(err);
    res.json({ message: 'order successfully deleted' });
  });
};
