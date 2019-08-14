var express = require('express');
var app = express(),
    bodyParser = require('body-parser');
var hotels = require('./server/controllers/hotels'),
    api = require('./server/controllers/api');
    users = require('./server/services/user.service');
var https = require('https');
var http = require('http');
portHTTP = process.env.HTTPPORT || 3000;
portHTTPS = process.env.HTTPSPORT || 443;

require('rootpath')();
var expressJwt = require('express-jwt');
var env = process.env.NODE_ENV || 'development';
var config = require('config.json')[env];
var cors = require('cors');

app.set("view engine", "pug");

// For BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// SSL Server
// fs = require('fs')
// sslOptions = {
//   key: fs.readFileSync(__dirname + '/encryption/private.key'),
//   cert: fs.readFileSync(__dirname + '/encryption/primary.crt'),
//   ca: fs.readFileSync(__dirname + '/encryption/ca.crt'),
//   requestCert: true,
//   rejectUnauthorized: false
// }

// Models
var models = require("./server/models");
models.sequelize
  .authenticate()
  .then(function () {
    console.log('Connection successful');
  })
  .catch(function (error) {
    console.log("Error creating connection:", error);
  });

// Sync Database
models.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine')
}).catch(function (err) {
  console.log(err, "Something went wrong with the Database Update!")
});

// ROUTES

app.get('/', function (req, res) {
  res.send('Welcome to Node !');
});
app.use(cors());

// routes
app.use('/api/users', require('./server/controllers/users.controller'));
app.use('/api/emails', require('./server/controllers/emails.controller'));

app.get('/hotels/:countrycode/:city/:page', hotels.show); // From Db
app.get('/api/:countrycode/:city/:page/:checkindate/:checkoutdate/:numofadults/:numofchildren', api.findHotelsByCityId); // From API
app.get('/api/:countrycode/:city/:page/:checkindate/:checkoutdate/:numofadults/:numofchildren/:hotelid', api.findHotelByHotelId); // From API
app.get('/api/HotelPolicy/:optionid', api.getPolicyForOptionId); // From API
app.post('/api/HotelBooking/:optionid/:roomid', api.bookForOptionIdRoomId); // From API
app.post('/api/RecordBookingDetails', api.recordBookingDetails); // From API
app.post('/api/BookingDetails', api.getBookingDetails); // From API
app.get('/hotels/getAllCities/:query', hotels.getAllCities); // From Db

app.post('/api/StorePaymentToken', api.storePaymentToken);
app.post('/api/SendEmail', api.sendEmail);

app.get("/api/TileImages", api.getTileImagesCMS);

app.set('port', process.env.PORT || 3000); // This reads from IIS port that has been set
app.listen(app.get('port'), function (err) {
  if (!err)
    console.log("Site is running at port : ", app.get('port')); 
  else console.log(err)
});

/*http.createServer(app).listen(portHTTP, function(err) {
  if (!err)
    console.log("HTTP SERVER RUNNING ON PORT : #{portHTTP}");
  else console.log(err);
});
/*https.createServer(app).listen(portHTTPS, function(err) {
  if (!err)
    console.log("HTTPS SSL SERVER RUNNING ON PORT : #{portHTTPS}");
  else console.log(err);
});*/