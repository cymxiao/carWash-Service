'use strict';


var mongoose = require('mongoose'),
  com = require('../models/communityModel'),
  Community = mongoose.model('community', com.schema),
  User = mongoose.model('users');

exports.get_pmc_users_by_status = function (req, res) { 
  User.find({ role: { $all: ["PMCUser"] } , status: { $all: [req.params.status] }} , null, { sort: { timestamp: -1 } }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).populate([{ path: 'community_ID', model: Community }]);
};




exports.create_a_user = function (req, res) {

  //console.log(req.is('text/*'));

  var new_user;
  if (req.body && req.body.data) {
    //if (req.body) {
    console.dir(req.body);
    var body = JSON.parse(req.body);

    new_user = new User(body);
    new_user.save(function (err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  } else {
    var chunk = '', userdata;
    req.on('data', function (data) {
      chunk += data; // here you get your raw data.
    })
    req.on('end', function () {
      // console.log('else path'); //just show in console
      // console.log(chunk);
      userdata = JSON.parse(chunk);


      User.findOne({ username: userdata.username }, function (err, task) {
        if (err)
          res.send(err);
        //check if username already exist
        if (!task) {
          //console.log(userdata);
          new_user = new User(userdata);
          new_user.save(function (err, task) {
            if (err)
              res.send(err);
            res.json(task);
          });
          //Cannot read property 'populate' of undefined
          //}).populate([{ path: 'community_ID', model: Community }]);
        } else {
          res.json({ _id:task._id ,duplicateUsername: true });
        }
      });
    })
  }
};


exports.login_a_user = function (req, res) {
  if(req.query.password.indexOf(' ')>=0){
    req.query.password = req.query.password.replace(' ','+');
  }
  //Amin : imp . { username: this.user.phone,password: this.user.pwd } input parameter look like this.
  User.findOne({ username: req.query.username, password: req.query.password }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).populate([{ path: 'community_ID', model: Community }]);
};


exports.get_user_by_username = function (req, res) {
  User.findOne({ username: req.params.username }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.read_a_user = function (req, res) {
  User.findById(req.params.username, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_user = function (req, res) {
  //console.log(req.body);
  var chunk = '', userdata;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () {

    userdata = JSON.parse(chunk);

    User.findOneAndUpdate({ _id: req.params.userId }, userdata, { new: true }, function (err, task) {
      if (err)
        res.send(err);
      res.json(task);
    }).populate([{ path: 'community_ID', model: Community }]);
  })
};


exports.delete_a_user = function (req, res) {


  User.remove({
    _id: req.params.userId
  }, function (err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
