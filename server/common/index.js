var http = require("http");
var express = require("express");
var qs = require("querystring");
//var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;

//var parser = new xml2js.Parser();

// xml5 is only HotelSearch
var hostHS = "xml5.travellanda.com";

// xml is other than HotelSearch
var hostOthers = "xml.travellanda.com";

// it is for demoy only
var hostDemo = "xmldemo.travellanda.com";

var port = null;
var path = "/xmlv1";

// username and password production
// var userName = "1d30ab517dd70cdd21c0649a0c4255fd";
// var password = "qFSVx6CUat7v";

//username and password test
var userName = "1d30ab517dd70cdd21c0649a0c4255fd";
var password = "mT7C0UxRPeVn";

var headerTemplate =
	'		<Username>USERNAME</Username>' +
	'		<Password>PASSWORD</Password>' +
	'		<RequestType>REQUESTTYPE</RequestType>';

var app = express();

module.exports = {
	performRequest(endpoint, method, requestType, body, success) {
		//console.log(requestType +  " : request type > BODY " + body);
		var currentHeader = headerTemplate;
		currentHeader = currentHeader.replace("REQUESTTYPE", requestType);
		currentHeader = currentHeader.replace("USERNAME", userName);
		currentHeader = currentHeader.replace("PASSWORD", password);

		var dataString = qs.stringify({
			xml: '<?xml version="1.0" encoding="UTF-8"?>\n' +
				' <Request>' +
				'	<Head>' +
				currentHeader +
				'	</Head>' +
				'	<Body>' +
				body +
				'	</Body>\n' +
				'</Request>'
		});

		var headers = {};

		if (method == 'GET') {
			endpoint += '?' + querystring.stringify(data);
		} else {
			headers = {
				'requesttype': requestType,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(dataString)
			};
		}
		console.log(dataString);

		if(requestType == 'HotelSearch') {
			var options = {
				host: hostHS,
				path: path,
				method: method,
				headers: headers
			};
		} else {
			var options = {
				host: hostOthers,
				path: path,
				method: method,
				headers: headers
			};
		}

		var req = http.request(options, function (res) {
			res.setEncoding('utf-8');

			var responseString = '';

			res.on('data', function (data) {
				//console.log(data);
				responseString += data;
			});


			res.on('end', function () {
				if (requestType == 'HotelPolicies') {
					parseString(responseString, {
						explicitArray: true,
						mergeAttrs: true
					}, function (err, result) {
						//console.dir(JSON.stringify(result));
						if (err || result.Response.Body.Error) {
							console.log("travellanda ERROR = ", result.Response.Body.Error || err);
							success(result.Response.Body);
						}
						else {
							if (requestType == 'HotelPolicies') {
								success(result.Response.Body);
							}
						}
					});
				} else {
					parseString(responseString, {
						explicitArray: false,
						mergeAttrs: true
					}, function (err, result) {
						//console.dir(JSON.stringify(result));
						if (err || result.Response.Body.Error) {
							console.log("travellanda ERROR = ", result.Response.Body.Error || err);
							success(result.Response.Body);
						}
						else {
							if (requestType == 'HotelSearch') {
								success(result.Response.Body.Hotels.Hotel);
							}
							if (requestType == 'GetHotelDetails') {
								success(result.Response.Body.Hotels.Hotel);
							}
							if (requestType == 'HotelPolicies') {
								success(result.Response.Body);
							}
							if (requestType == 'HotelBooking') {
								success(result.Response.Body.HotelBooking);
							}
							if (requestType == 'HotelBookingDetails') {
								success(result.Response.Body.Bookings.HotelBooking);
							}
						}
					});
					//success(responseString);
				};
			});
		});

		req.write(dataString);
		req.end();
	},
};