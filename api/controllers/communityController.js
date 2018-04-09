'use strict';


var mongoose = require('mongoose'),
  Community = mongoose.model('community');

  var community = require('../controllers/communityController');

exports.list_all_communities = function(req, res) {
  Community.find({}, function(err, community) {
    if (err)
      res.send(err);
    res.json(community);
  });
};

exports.find_communities = function (req, res) { 
  Community.find({ name: community.fuzzyMatch(req.query.name) }, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


  //Todo: I would move the following method to baseController.ts until mfw-2070 merged to master branch.
  exports.fuzzyMatch =    function(source) {
    let regexSearchString = '\.*' + source + '\.*';
    //console.log(regexSearchString);
    return new RegExp(regexSearchString, 'i');
  }


exports.create_a_community = function(req, res) {

  var chunk = '', communitydata;
  req.on('data', function (data) {
    chunk += data; // here you get your raw data.
  })
  req.on('end', function () { 
   
    communitydata = JSON.parse(chunk);
    //console.log(userdata);
    var new_community = new Community(communitydata);
    new_community.save(function(err, community) {
      if (err)
        res.send(err);
      res.json(community);
    });
  })


};


exports.read_a_community = function(req, res) {
    Community.findById(req.params.taskId, function(err, community) {
    if (err)
      res.send(err);
    res.json(community);
  });
};


// exports.update_a_task = function(req, res) {
//   Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };


// exports.delete_a_task = function(req, res) {


//   Task.remove({
//     _id: req.params.taskId
//   }, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Task successfully deleted' });
//   });
//};
