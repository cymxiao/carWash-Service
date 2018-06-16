'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');
 
 
  app.route('/pmcusers/:status')
    .get(user.get_pmc_users_by_status);
 
  app.route('/users') 
    .post(user.create_a_user);//, jsonParser);

  app.route('/userlogin')
    .get(user.login_a_user)


  app.route('/users/:username')
    .get(user.get_user_by_username);

    //should be called as req.params.userId
  app.route('/users/:userId')
    .get(user.read_a_user)
    //.put(user.update_a_user)
    .post(user.update_a_user)
    .delete(user.delete_a_user);
};
