'use strict';


var mongoose = require('mongoose'),

  xjMember = mongoose.model('xjMembers');

exports.list_all_xjMembers = function (req, res) {
  let sortExpresion = { timestamp: -1 };
  if (req.params.sortByBth && req.params.sortByBth === '1') {
    sortExpresion = { birthday: 1 };
  } 
  xjMember.find({}, null, { sort: sortExpresion }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.get_a_xjMember = function (req, res) {
  xjMember.findOne({ name: req.params.name }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};



exports.save_a_xjMember = function (req, res) {

  var new_user;
  if (req.body && req.body.data) {
    //if (req.body) {
    console.dir(req.body);
    var body = JSON.parse(req.body);

    new_user = new xjMember(body);
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
      let searchCreteria = {};
      if (userdata.cellPhone) {
        searchCreteria = { name: userdata.name, cellPhone: userdata.cellPhone };
      } else {
        searchCreteria = { name: userdata.name }
      }

      xjMember.findOne(searchCreteria, function (err, task) {
        if (err)
          res.send(err);
        //check if username already exist
        if (!task) {
          //console.log(userdata);
          new_user = new xjMember(userdata);
          new_user.save(function (err, task) {
            if (err)
              res.send(err);
            res.json(task);
          });//.populate([{ path: 'community_ID', model: Community }]);
        } else {
          //res.json({ _id:task._id ,duplicateUsername: true });
          xjMember.findOneAndUpdate({ _id: task._id }, userdata, { new: true }, function (err, task) {
            if (err)
              res.send(err);
            res.json(task);
          });
        }
      });
    })
  }
};


exports.update_a_xjMember = function (req, res) {
  //console.log(req.body);
  var chunk = '', userdata;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () {

    userdata = JSON.parse(chunk);

    xjMember.findOneAndUpdate({ _id: req.params.xjMemberId }, userdata, { new: true }, function (err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  })
};


exports.delete_a_xjMember = function (req, res) {
  xjMember.remove({
    _id: req.params.xjMemberId
  }, function (err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
