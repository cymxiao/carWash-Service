'use strict';
module.exports = function(app) {
  var acntCtrl = require('../controllers/accountController');

app.route('/accounts') 
  .post(acntCtrl.create_a_account);//, jsonParser);

app.route('/account/:userId') 
  .get(acntCtrl.find_a_account_by_userId)
  .post(acntCtrl.update_a_account_credit);

app.route('/updateaccount/:userId')  
  .post(acntCtrl.update_a_account);
}