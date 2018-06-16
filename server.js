var express = require('express'),
  app = express(),

//Amin:IMP.  Each time add a new route, please check server.js

  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  //Task = require('./api/models/todoListModel'), //created model loading here
  User = require('./api/models/userModel'), //created user loading here
  Country = require('./api/models/countryModel'),
  City = require('./api/models/cityModel'),
  Community = require('./api/models/communityModel'),
  Carport = require('./api/models/carportModel'),
  LeisurePark = require('./api/models/leisureParkModel'),
  Role = require('./api/models/roleModel'),
  Account = require('./api/models/accountModel'),
  xmMember = require('./api/models/xjMemberModel'),
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/parking');

 
//The bodyParser object exposes various factories to create middlewares. All middlewares 
//will populate the req.body property with the parsed body when the Content-Type request header matches 
//the type option, or an empty object ({}) if there was no body to parse, the Content-Type was not matched, or an error occurred.

//temp solution, I don't how to set requet content-type to application/json, so here I use {type:'text/plain'} to match
//the client request type, so I can get req.body here.
 
app.use(function (req, res, next) {

  //req.header("Content-Type", "application/json"); 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
 
  //add return before next(), it may resolve issue like: Can't set headers after they are sent.
  return next();
});
 
 
var users = require('./api/routes/userRoutes');
var maps = require('./api/routes/mapRoutes');
var country = require('./api/routes/countryRoutes');
var city = require('./api/routes/cityRoutes');
var community = require('./api/routes/communityRoutes');
var carport = require('./api/routes/carportRoutes');
var leisurePark = require('./api/routes/leisureParkRoutes');
var role = require('./api/routes/roleRoutes');
var account = require('./api/routes/accountRoutes'); 
var sms = require('./api/routes/smsRoutes');  
var member = require('./api/routes/xjMemberRoutes'); 

users(app);
maps(app);
country(app);
city(app);
community(app);
carport(app);
leisurePark(app);
role(app);
account(app);
sms(app);
member(app);
 
app.listen(port); 
app.use(bodyParser.json());
//Amin:IMP the following line resolve issue like: Can't set headers after they are sent.
app.disable('etag');
console.log('Community RESTful API server started on: ' + port);
 

const mongoDb = mongoose.connection;

  mongoDb.on('error', (x) => {
    //console.log('Unable to connect to database!'); 
    //Amin: IMP.It's better to throw error here. If not throw x, client side would try about  30 secs to connect to this service, Bad UI experience.
    throw x;
  });

  // mongoDb.once('open', () => {
  //   //console.log('Connect to database successful.');
  // });

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' });
  res.end();
});
