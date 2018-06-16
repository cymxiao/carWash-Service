'use strict';
module.exports = function(app) {
  var order = require('../controllers/orderController');
 
  app.route('/order')
    .get(order.list_all_orders)
    .post(order.create_a_order);


  app.route('/order/:orderId')
    .get(order.read_a_order)
    .post(order.update_a_order)
    .delete(order.delete_a_order);

  app.route('/getorder/:ownerId')
    .get(order.list_orders_for_Owner);
  
  app.route('/getorderforApplier/:applierId')
    .get(order.list_orders_for_Applier);
  
  app.route('/getorderbyCom/:comId/:ownerId')
    .get(order.list_orders_by_Community);

  app.route('/grouporder')
    .get(order.groupCountbyCommunity);

  // app.route('/checkStartTime/:comId/:ownerId/:cpId/:startTime')
  //   .get(order.checkStartTime);

  // app.route('/checkEndTime/:comId/:ownerId/:cpId/:endTime')
  //   .get(order.checkEndTime);

  // app.route('/getStartTimeforNext/:comId/:ownerId/:cpId')
  //   .get(order.getStartTimeforNext);

  app.route('/testTime')
    .get(order.testTime);
};
