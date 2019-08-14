var helpers = require("../common");
var express = require("express");

module.exports = {
	getHotelDetails(cityId, countryCode, checkInDate, checkOutDate, numOfAdults, numOfChildren, requestType) {
		var Body = commonHelpers.HotelByHotelId(HotelId, "GetHotelDetails");
		helpers.performRequest('', 'POST', requestType, Body, function (data) {
			//console.log('Fetched ' + data.result.paging.total_items + ' Hotels');
			//HotelDetailArray = data.replace('"HotelId"', 'HotelId');
			console.log(data);
		});
	},
	getRoomsDetails(cityId, countryCode, checkInDate, checkOutDate, numOfAdults, numOfChildren, requestType) {
		models.Cities.findAll({
			where: {
				CityName: CityName,
				CountryCode: CountryCode
			},
			attributes: ['CityId'],
			limit: 1
		}).then(City => { // Try for models.Cities.findAll
			Body = commonHelpers.HotelsByCityId(City[0].CityId, CountryCode, CheckInDate, CheckOutDate, NumOfAdults, NumOfChildren, "HotelSearch");
			helpers.performRequest('', 'POST', "HotelSearch", Body, function (data1) {
				//console.log('Fetched ' + data.result.paging.total_items + ' Hotels');
				//HotelRoomsArray = HotelRoomsArray.replace('"HotelId"', 'HotelId');
				// Merge Results with Hotels Searched For
				//var mergedList = _.map(HotelDetailArray, function(item){
				//	return _.extend(item, _.find(HotelRoomsArray, { HotelId: item.HotelId }));
				//});
				res.status(200).json(data1);
			});
		}).catch(err => { // Catch for models.Cities.findAll
			return err;
		});
	}
};