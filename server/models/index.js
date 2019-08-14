'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config')[env];
var config    = require(__dirname + '/../config/config')[env];
var db        = {};

console.log(env);

var sequelize = new Sequelize(config.database, config.username, config.password, config);

//Create a Sequelize connection to the database using the URL in config/config.js
// if (process.env.NODE_ENV) {
  // var sequelize = new Sequelize(process.env[config.NODE_ENV]);
// } else {
//   var sequelize = new Sequelize(config.url, config);
// }

//Load all the models
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Export the db Object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models
db.Cities = require('../models/cities.js')(sequelize, Sequelize);  
db.Hotels = require('../models/hotels.js')(sequelize, Sequelize);  
db.Facilities = require('../models/facilities.js')(sequelize, Sequelize);  
db.Descriptions = require('../models/descriptions.js')(sequelize, Sequelize);  
db.Images = require('../models/images.js')(sequelize, Sequelize);  
db.Users = require('../models/user.js')(sequelize, Sequelize);  
db.Transactions = require('../models/transactions.js')(sequelize, Sequelize);  
db.Alerts = require('../models/alerts.js')(sequelize, Sequelize);  
db.Policies = require('../models/policies.js')(sequelize, Sequelize);  
db.Restrictions = require('../models/restrictions.js')(sequelize, Sequelize);  
db.Rooms = require('../models/rooms.js')(sequelize, Sequelize);  

// Relations
db.Cities.hasMany(db.Hotels, {
  foreignKey: 'CityId'
});
// db.Hotels.belongsTo(db.Cities, {
//   // as: 'FK_Hotels_Cities',
//   as: 'cities',
//   foreignKey: 'CityId',
//   constraints: false
// });

db.Hotels.hasMany(db.Facilities, {
  foreignKey: 'HotelId'
});
// db.Facilities.belongsTo(db.Hotels, {
//   // as: 'FK_Facilities_Hotels',
//   foreignKey: 'HotelId',
//   constraints: false
// });

db.Hotels.hasMany(db.Images, {
  foreignKey: 'HotelId'
});
// db.Images.belongsTo(db.Hotels, {
//   // as: 'FK_Images_Hotels',
//   foreignKey: 'HotelId',
//   constraints: false
// });

db.Hotels.hasMany(db.Descriptions, {
  foreignKey: 'HotelId'
});
// db.Descriptions.belongsTo(db.Hotels, {
//   // as: 'FK_Descriptions_Hotels',
//   foreignKey: 'HotelId',
//   constraints: false
// });
db.Hotels.hasMany(db.Transactions, {
  foreignKey: 'HotelId'
});

db.Transactions.hasMany(db.Alerts, {
  foreignKey: 'TransactionId'
});
db.Transactions.hasMany(db.Policies, {
  foreignKey: 'TransactionId'
});
db.Transactions.hasMany(db.Restrictions, {
  foreignKey: 'TransactionId'
});
db.Transactions.hasMany(db.Rooms, {
  foreignKey: 'TransactionId'
});

module.exports = db;