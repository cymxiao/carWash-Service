'use strict';


var mongoose = require('mongoose'),
  Carport = mongoose.model('carport');

exports.list_all_carports = function(req, res) {
  Carport.find({}, function(err, carport) {
    if (err)
      res.send(err);
    res.json(carport);
  });
};


exports.read_a_carport = function(req, res) {
    Carport.findById(req.params.taskId, function(err, carport) {
    if (err)
      res.send(err);
    res.json(carport);
  });
};

exports.create_a_carport = function(req, res) {
  var new_carport = new Carport(req.body);
  new_carport.save(function(err, carport) {
    if (err)
      res.send(err);
    res.json(carport);
  });
}; 

exports.update_a_carport = function(req, res) {
    Carport.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, carport) {
    if (err)
      res.send(err);
    res.json(carport);
  });
};


exports.delete_a_carport = function(req, res) { 
    Carport.remove({
    _id: req.params.taskId
  }, function(err, carport) {
    if (err)
      res.send(err);
    res.json({ message: 'carport successfully deleted' });
  });
};