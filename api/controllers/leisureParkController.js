'use strict';


var mongoose = require('mongoose'),
  //Carport = mongoose.model('carport'),
  cp = require('../models/carportModel'),
  u = require('../models/userModel'),
  Carport = mongoose.model('carport', cp.schema),
  //com = require('../models/communityModel'),
  User = require('../models/userModel',u.schema),
  //Community = mongoose.model('community', com.schema),
  LeisurePark = mongoose.model('leisurePark');
 
//   var moment = require('moment');
// var moment = require('moment-timezone');
// var zone = 'Asia/Shanghai';
// var dtNow = moment(Date.now()).tz(zone).format();

  
exports.list_all_leisureParks = function (req, res) {
  LeisurePark.find({}, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  });
};

exports.testTime = function (req, res) {
   //res.json({mtime: dtNow , mtime2: moment(), mTime3: moment(new Date()), jsTime: new Date(), jsTime2: Date.now()});
   res.json({  jsTime: new Date(), jsTime2: Date.now() , jsTime3: Date.now });
};

exports.list_leisureParks_for_Owner = function (req, res) { 
  LeisurePark.find({ shared_UserID : req.params.ownerId ,  endTime: {"$gte": new Date() }}, null, {sort: { timestamp: -1 }}, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  }).populate([{path:'carport_ID', model : Carport }]);
  //.sort({ timestamp : 1}) 
  //}).populate('carport_ID');
};

exports.checkStartTime = function (req, res) { 
  //console.log( req.params.startTime );
  LeisurePark.findOne({  community_ID : req.params.comId, status : 'active', shared_UserID : req.params.ownerId , carport_ID: req.params.cpId, startTime : {"$lte": req.params.startTime} , endTime: {"$gte": req.params.startTime }}, null, {sort: { timestamp: -1 }}, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  }); 
};

exports.checkEndTime = function (req, res) { 
  //console.log( req.params.endTime );
  LeisurePark.findOne({  community_ID : req.params.comId, status : 'active', shared_UserID : req.params.ownerId , carport_ID: req.params.cpId,  endTime: {"$gte": req.params.endTime }}, null, {sort: { timestamp: -1 }}, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  }); 
};

exports.getStartTimeforNext = function (req, res) { 
  LeisurePark.findOne({  community_ID : req.params.comId, status : 'active', shared_UserID : req.params.ownerId , carport_ID: req.params.cpId }, null, {sort: { timestamp: -1 }}, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  }); 
};



exports.list_leisureParks_for_Applier = function (req, res) { 
  LeisurePark.find({ applied_UserID : req.params.applierId}, null, {sort: { timestamp: -1 }}, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  }).populate([{path:'carport_ID', model : Carport }]);
  //.sort({ timestamp : 1}) 
  //}).populate('carport_ID');
};


exports.list_leisureParks_by_Community = function (req, res) {
  //if 000000000000000000000000, it would list all the share leisurepark of the community
  //Amin:Tocheck It used for PMC dashboard, so applied_UserID should be defined or emtpy. it's not null or undefined.
  if (req.params.ownerId === '000000000000000000000000') {
    LeisurePark.find({
      community_ID: req.params.comId, 
      // status: { "$ne": 'invalid' },
      endTime: { "$gte": new Date() }
      //order by date ascending
    }, null, { sort: { timestamp: 1 } }, function (err, leisurePark) {
      if (err)
        res.send(err);
      res.json(leisurePark);
    }).populate([{ path: 'carport_ID', model: Carport }])
      .populate([{ path: 'shared_UserID', model: User }])
      .populate([{ path: 'applied_UserID', model: User }]);
  } else { 
    LeisurePark.find({
      community_ID: req.params.comId, status: 'active',
      shared_UserID: { "$ne": req.params.ownerId }, endTime: { "$gte": new Date() }
    }, null, { sort: { timestamp: -1 } }, function (err, leisurePark) {
      if (err)
        res.send(err);
      res.json(leisurePark);
    }).populate([{ path: 'carport_ID', model: Carport }]).populate([{ path: 'shared_UserID', model: User }]);
  }
};



exports.groupCountbyCommunity = function (req, res) {
  //Amin:tocheck  status is a array column, it seems works in aggregate
  var rules = [{ priceUnit: '天' } ,{status : 'active'}]; //, {price: {$gte: 200}} 
  LeisurePark.aggregate([
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


exports.read_a_leisurePark = function (req, res) {
  LeisurePark.findById(req.params.taskId, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json(leisurePark);
  });
};

exports.create_a_leisurePark = function (req, res) {

  var chunk = '', data;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () {

    data = JSON.parse(chunk);
    var new_leisurePark = new LeisurePark(data);
    new_leisurePark.save(function (err, leisurePark) {
      if (err)
        res.send(err);
      res.json(leisurePark);
    });
  });
}


exports.update_a_leisurePark = function (req, res) {

  var chunk = '', data;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () {

    data = JSON.parse(chunk);
    LeisurePark.findOneAndUpdate({ _id: req.params.leisureParkId }, data, { new: true }, function (err, leisurePark) {
      if (err)
        res.send(err);
      res.json(leisurePark);
    });
  });
};


exports.delete_a_leisurePark = function (req, res) {
  LeisurePark.remove({
    _id: req.params.taskId
  }, function (err, leisurePark) {
    if (err)
      res.send(err);
    res.json({ message: 'leisurePark successfully deleted' });
  });
};
