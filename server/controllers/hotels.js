var models = require("../models");
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config')[env];
var config = require(__dirname + '/../config/config')[env];

var sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = {
  //Get a list of all Hotels using model.findAll()
  index(req, res) {

    // sequelize.query('SELECT `hotels`.*,`facilities`.`HotelId` AS `facilities.HotelId`,`facilities`.`FacilityType` AS `facilities.FacilityType`, `facilities`.`FacilityName` AS `facilities.FacilityName`, `facilities`.`createdAt` AS `facilities.createdAt`,`facilities`.`updatedAt` AS `facilities.updatedAt` FROM `hotels` AS `hotels`  INNER JOIN `facilities` AS `facilities` ON `hotels`.`HotelId` = `facilities`.`HotelId` WHERE    `hotels`.`CityId` = 668815 LIMIT 0 , 10', {
    //     // replacements: {
    //     //   status: ['active', 'inactive']
    //     // },
    //     type: sequelize.QueryTypes.SELECT
    //   }).then(function (hotel) {
    //     res.status(200).json(hotel);
    //   })
    //   .catch(function (error) {
    //     res.status(500).json(error);
    //   });

    models.Hotels.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('hotelid')), 'hotelstotal']
        ],
        include: ['descriptions'],
        limit: 10
      })
      .then(function (hotel) {
        res.status(200).json(hotel);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get an Hotels by the unique ID using model.findById()
  show(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    // Get the City Id from Name
    models.Cities.findAll({
      where: {
        CityName: req.params.city,
        CountryCode: req.params.countrycode
      },
      attributes: ['CityId'],
      limit: 1
    }).then(City => {
      let limit = parseInt(process.env.SEARCHLIMIT, 10) || 50;
      let offset = 0;
      models.Hotels.findAndCountAll({
          where: {
            CityId: City[0].CityId
          }
        })
        .then((data) => { // findAndCountAll
          let page = req.params.page; // Page Number from the route
          let pages = Math.ceil(data.count / limit);
          offset = limit * (page - 1);
          console.log('TotalRows: ' + data.count + '  TotalPages: ' + pages + '  PageNo: ' + page + '  Offset: ' + offset);
          models.Hotels.findAll({
            include: ['facilities', 'images', 'descriptions'],
            where: {
              CityId: City[0].CityId
            },
            limit: limit || 50,
            offset: offset || 0,
            sort: {
              StarRating: 1
            }
          }).then(hotel => { // findAll
            res.status(200).json(hotel);
          }).catch(error => { // findAll
            res.status(500).json(error);
          });
        }).catch(error => { // findAndCountAll
          res.status(500).json(error);
        });
    }).catch(error => {
      res.status(500).json(error);
    });

  },

  //Get All Cities
  getAllCities(req, res) {
    models.Cities.findAll({
        attributes: [
          [models.Sequelize.fn("concat", Sequelize.col("CityName"), ", ", Sequelize.col("CountryCode")), 'cities']
        ],
        where: {
          CityName: {
            $like: '%' + req.params.query + '%'
          }
        }
      })
      .then((cities) => {
        res.status(200).json(cities);
      }).catch(error => {
        res.status(500).json(error);
      });
  },

  //Create a new Hotels using model.create()
  create(req, res) {
    Hotels.create(req.body)
      .then(function (newHotel) {
        res.status(200).json(newHotel);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Edit an existing Hotels details using model.update()
  update(req, res) {
    Hotels.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then(function (updatedRecords) {
        res.status(200).json(updatedRecords);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Delete an existing Hotels by the unique ID using model.destroy()
  delete(req, res) {
    Hotels.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(function (deletedRecords) {
        res.status(200).json(deletedRecords);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  }
};