require('dotenv').config();
var http = require("http");
var express = require("express");
var qs = require("querystring");
var parseString = require('xml2js').parseString;
var dateFormat = require('dateformat');
var models = require("../models");
var helpers = require("../common");
var commonHelpers = require("../common/commonHelpers");
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config.json')[env];
var _ = require('lodash');

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

var sequelize = new Sequelize(config.database, config.username, config.password, config);

var app = express(),
  bodyParser = require('body-parser');

var sendDataWhenReady = function (hotelDetailArray, hotelRoomsArray, res) {
  if (hotelDetailArray == null || hotelRoomsArray == null) {
    console.log("one of them was null");
    return;
  }
  //console.log(hotelDetailArray);
  //console.log(hotelRoomsArray);

  var hotel = _.find(hotelRoomsArray, {
    HotelId: hotelDetailArray.HotelId
  });
  if (hotel) {
    hotelDetailArray.Options = hotel.Options;
    console.log(hotelDetailArray);
    res.status(200).json(hotelDetailArray);
  } else {
    console.log("Hotel Availability Not Found !");
    res.status(500).send("Hotel Availability Not Found !");
  }
  /*
  var hotel;
  for (var i = 0, len = hotelRoomsArray.length; i < len; i++) {
  	if (hotelRoomsArray[i].HotelId === hotelDetailArray.HotelId){
  		hotel = hotelRoomsArray[i];
  		break;
  	}
  }
  hotelDetailArray.Options =hotel.Options;
  */
  /*
  var mergedList = _.map(hotelDetailArray, function(item){
  	return _.extend(item, _.find(hotelRoomsArray, { HotelId: item.HotelId }));
  });
  */
};

module.exports = {
  findHotelsByCityId(req, res) {
    var CityName = req.params.city;
    var CountryCode = req.params.countrycode;
    var CheckInDate = dateFormat(req.params.checkindate, "yyyy-mm-dd");
    var CheckOutDate = dateFormat(req.params.checkoutdate, "yyyy-mm-dd");
    var NumOfAdults = req.params.numofadults;
    var NumOfChildren = req.params.numofchildren || 0;

    models.Cities.findAll({
      where: {
        CityName: CityName,
        CountryCode: CountryCode
      },
      attributes: ['CityId'],
      limit: 1
    }).then(City => { // Try for models.Cities.findAll
      console.log(City[0].CityId);
      var Body = commonHelpers.HotelsByCityId(City[0].CityId, CountryCode, CheckInDate, CheckOutDate, NumOfAdults, NumOfChildren, "HotelSearch");
      helpers.performRequest('', 'POST', "HotelSearch", Body, function (data) {
        //console.log('Fetched ' + data.result.paging.total_items + ' Hotels');
        res.status(200).json(data);
      });
    }).catch(err => { // Catch for models.Cities.findAll
      return err;
    });

  },
  findHotelByHotelId(req, res) {

    var CityName = req.params.city;
    var CountryCode = req.params.countrycode;
    var CheckInDate = dateFormat(req.params.checkindate, "yyyy-mm-dd");
    var CheckOutDate = dateFormat(req.params.checkoutdate, "yyyy-mm-dd");
    var NumOfAdults = req.params.numofadults;
    var NumOfChildren = req.params.numofchildren > 0 ? 6 : 0;
    var HotelId = req.params.hotelid;

    var HotelDetailArray;
    var HotelRoomsArray;

    var Body = commonHelpers.HotelByHotelId(HotelId, "GetHotelDetails");
    helpers.performRequest('', 'POST', "GetHotelDetails", Body, function (data) {
      // console.log("GetHotelDetails Success/Failure Data = ", data);
      if (data.Error) {
        res.status(200).json({ error: true, message: "Hotel Details Not Found !", travellanda: data });
        return;
      }
      else {
        HotelDetailArray = data;
        sendDataWhenReady(HotelDetailArray, HotelRoomsArray, res);
      }
    });

    models.Cities.findAll({
      where: {
        CityName: CityName,
        CountryCode: CountryCode
      },
      attributes: ['CityId'],
      limit: 1
    }).then(City => { // Try for models.Cities.findAll
      var Body1 = commonHelpers.HotelsByCityId(City[0].CityId, CountryCode, CheckInDate, CheckOutDate, NumOfAdults, NumOfChildren, "HotelSearch");
      helpers.performRequest('', 'POST', "HotelSearch", Body1, function (data1) {
        //HotelRoomsArray = HotelRoomsArray.replace('"HotelId"', 'HotelId');
        // Merge Results with Hotels Searched For
        // console.log("HotelSearch Success/Failure Data = ", data1);
        if (data1.Error) {
          res.status(200).json({ error: true, message: "Hotel Rooms Availability Not Found !", travellanda: data1 });
          return;
        }
        else {
          HotelRoomsArray = data1;
          sendDataWhenReady(HotelDetailArray, HotelRoomsArray, res);
        }
      });
    }).catch(err => { // Catch for models.Cities.findAll
      return err;
    });
  },
  getPolicyForOptionId(req, res) {

    var OptionId = req.params.optionid;

    var Body = commonHelpers.HotelPolicyByOptionId(OptionId, "HotelPolicies");
    helpers.performRequest('', 'POST', "HotelPolicies", Body, function (data) {
      if (data != 'undefined' || !data.Error) {
        res.status(200).json(data);
      }
      else {
        console.log('HotelPolicies Error Data : ', data);
        res.status(200).json({ error: true, message: "Hotel Policy not available or Error Occurred !", travellanda: data });
      }
    });
  },
  bookForOptionIdRoomId(req, res) {

    var OptionId = req.params.optionid;
    var RoomId = req.params.roomid;
    console.log("PERSONAL DETAILS : ", req.body)
    var Body = commonHelpers.HotelBookingByOptionIdRoomId(OptionId, RoomId, req.body, "HotelBooking");
    helpers.performRequest('', 'POST', "HotelBooking", Body, function (data) {
      if (data != 'undefined' || !data.Error) {
        console.log('HotelBooking Response Data : ', data);
        res.status(200).json(data);
      }
      else {
        console.log('HotelBooking Error Data : ', data);
        res.status(200).json({ error: true, message: "Hotel Booking not available or Error Occurred !", travellanda: data });
      }
    });
  },
  getBookingDetails(req, res) {
    var Body = commonHelpers.GetBookingDetails(req.body);
    helpers.performRequest('', 'POST', "HotelBookingDetails", Body, function (data) {
      console.log('HotelBookingDetails Response Data : ', data);
      if (data != 'undefined' || !data.Error) {
        res.status(200).json(data);
      }
      else {
        console.log('HotelBookingDetails Error Data : ', data);
        res.status(200).json({ error: true, message: "Hotel Booking Details not returned or Error Occurred !", travellanda: data });
      }
    });
  },
  recordBookingDetails(req, res) {
    console.log("Req.body : ", req.body);
    let previouslyGeneratedTransactionId = req.body.TransactionId;
    var Body = commonHelpers.GetBookingDetails(req.body);
    helpers.performRequest('', 'POST', "HotelBookingDetails", Body, function (data) {
      console.log('HotelBookingDetails Response Data : ', data);
      if (data != 'undefined' || !data.Error) {
        // SendBooking Details to Client
        res.status(200).json(data);
        
        // Save the foreign table data
        let Rooms = data.Rooms;
        let Policies = data.Policies;
        let Restrictions = data.Restrictions;
        let Alerts = data.Alerts;

        // console.log("data.Alerts.Alert Instance of Array : ", (data.Alerts.Alert instanceof Array));
        Alerts.Alert = (data.Alerts.Alert instanceof Array) ? data.Alerts.Alert.join() : data.Alerts.Alert;
        console.log("JOIN data.Alerts.Alert.join() : " + Alerts.Alert);

        let omittedTransaction = _.omit(data, ['Rooms', 'Policies', 'Restrictions', 'Alerts']);
        omittedTransaction.CheckInDate = omittedTransaction.CheckInDate + "T00:00:00";
        omittedTransaction.CheckOutDate = omittedTransaction.CheckOutDate + "T00:00:00";
        omittedTransaction.CancellationDeadline = omittedTransaction.CancellationDeadline + "T00:00:00";

        omittedTransaction.TotalPrice = req.body.TotalPrice;
        omittedTransaction.AgentPrice = req.body.AgentPrice;
        console.log("req.body.TotalPrice : ", req.body.TotalPrice);
        
        console.log("OmittedTransaction : ", omittedTransaction);
        req.body = omittedTransaction;
        // Add to transactions
        models.Transactions.update(req.body, {
          where: {
            TransactionId: previouslyGeneratedTransactionId
          }
        })
          .then(function (updatedTransaction) {
            console.log("Updated Transaction : ", updatedTransaction);

            Rooms.Room.TransactionId =
              Policies.Policy.TransactionId =
              Restrictions.TransactionId =
              Alerts.TransactionId = previouslyGeneratedTransactionId;

             if (Rooms.Room != '') {
              models.Rooms.create(Rooms.Room)
                .then(function (newRoom) {
                  console.log("ROOM CREATED : " + newRoom);
                })
                .catch(function (error) {
                  console.log("ROOM ERROR : " + error);
                });
            }

            if (Policies.Policy != '') {
              models.Policies.create(Policies.Policy)
                .then(function (newPolicies) {
                  console.log("POLICY CREATED : " + newPolicies);
                })
                .catch(function (error) {
                  console.log("POLICY ERROR" + error);
                });
            }

            if (Restrictions != '') {
              models.Restrictions.create(Restrictions)
                .then(function (newRestrictions) {
                  console.log("RESTRICTION CREATED : " + newRestrictions);
                })
                .catch(function (error) {
                  console.log("RESTRICTION ERROR" + error);
                });
            }

            if (Alerts) {
              models.Alerts.create(Alerts)
                .then(function (newAlerts) {
                  console.log("ALERTS CREATED : " + newAlerts);
                })
                .catch(function (error) {
                  console.log("ALERTS ERROR" + error);
                });
            }
          })
          .catch(function (error) {
            console.log("OVERALL ERROR" + error);
          });
      }
      else
        res.status(500).json({ success: false });
    });
  },
  storePaymentToken(req, res) {
    console.log(req.body, req.body.UserId, req.body.PaymentToken);
    let transactionId;
    stripe.customers.create({
      email: req.body.UserId,
      source: req.body.PaymentToken
    })
      .then(customer => {
        console.log(customer);
        transactionId = customer.created;
        let amount = req.body.Amount;
        const idempotency_key = req.body.PaymentToken + "_" + customer.UserId + "_" + req.body.Amount;  // prevent duplicate charges
        let source = req.body.PaymentToken;
        let currency = req.body.Currency;
        let charge = { amount, source };
        console.log(charge);

        return stripe.charges.create({
          amount: amount,
          currency: currency,
          customer: customer.id
        });
      })
      .then(charge => {
        console.log("Charge : ", charge);
        console.log("Req.Body : ", req.body);
        let transaction = {
          TransactionId: transactionId, TotalPrice: req.body.Amount, UserId: req.body.UserId,
          PaymentChargeId: charge.id, PaymentCustomerId: charge.customer, PaymentCardId: charge.source.id,
          PaymentToken: req.body.PaymentToken, Currency: req.body.Currency
        };
        console.log("Transaction Created Commencing : ", transaction);
        models.Transactions.create(transaction)
          .then(success => {
            console.log("Transaction Created Success : ", success);
            res.status(200).json(success);
          })
          .catch(err => {
            console.log("Transaction Created FAILED : ", err);
            res.status(500).json(err);
          });
        //res.status(200).json(charge);
      })
      .catch(function (error) {
        console.log("Error in customer create : " + error);
        res.status(500).json(error);
      });
  },
  getTileImagesCMS(req, res) {
    const tileImageFolder = './Images/';
    const fs = require('fs');

    fs.readdir(tileImageFolder, (err, files) => {
      let tileImagesArray = [];
      files.forEach(file => {
        console.log(file);
        let splitParts = file.split('.')[0].split('_');
        tileImagesArray.push(
          {
            Collection: splitParts[0], HotelId: splitParts[1], Checkin: splitParts[2], Checkout: splitParts[3],
            StarRating: splitParts[4], HotelName: splitParts[5], HotelCityOrPlace: splitParts[6], Price: splitParts[7] | '0', FileName: file
          }
        );
      });
      //console.log(tileImagesArray);
      res.status(200).json(tileImagesArray);
    })
  },
  sendEmail(req, res) {
    // Send Email using Mail Chimp 
    const path = require('path');
    var mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUNAPIKEY, domain: process.env.MAILGUNDOMAIN });

    var data = {
      from: process.env.FROMEMAIL,
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.message
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
      if (!error)
        res.status(200).json({ success: true, message: body });
      else
        res.status(500).json({ success: false, message: body });
    });

  }
};
