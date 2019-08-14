var helpers = require("../common");
var express = require("express");

module.exports = {
	HotelsByCityId(cityId, countryCode, checkInDate, checkOutDate, numOfAdults, childAge, requestType) {
		let addChildSection = childAge > 0 ? true : false;
		// Get the City Id from Name
		var Body = addChildSection ?
			'		<CityIds>' +
			'			<CityId>' + cityId + '</CityId>' +
			'		</CityIds>' +
			'		<CheckInDate>' + checkInDate + '</CheckInDate>' +
			'		<CheckOutDate>' + checkOutDate + '</CheckOutDate>' +
			'		<Rooms>' +
			'			<Room>' +
			'				<NumAdults>' + numOfAdults + '</NumAdults>' +
			'				<Children>' +
			'					<ChildAge>' + childAge + '</ChildAge>' +
			'				</Children>' +
			'			</Room>' +
			'		</Rooms>' +
			'		<Nationality>AU</Nationality>' +
			'		<Currency>GBP</Currency>' +
			'		<AvailableOnly>1</AvailableOnly>'
			:

			'		<CityIds>' +
			'			<CityId>' + cityId + '</CityId>' +
			'		</CityIds>' +
			'		<CheckInDate>' + checkInDate + '</CheckInDate>' +
			'		<CheckOutDate>' + checkOutDate + '</CheckOutDate>' +
			'		<Rooms>' +
			'			<Room>' +
			'				<NumAdults>' + numOfAdults + '</NumAdults>' +
			'			</Room>' +
			'		</Rooms>' +
			'		<Nationality>AU</Nationality>' +
			'		<Currency>GBP</Currency>' +
			'		<AvailableOnly>1</AvailableOnly>';
		//console.log(Body);

		return Body;
	},
	HotelByHotelId(hotelId, requestType) {
		var Body =
			'<HotelIds>' +
			'<HotelId>' + hotelId + '</HotelId>' +
			'</HotelIds>';
		//console.log(Body);
		return Body;
	},
	HotelPolicyByOptionId(optionId, requestType) {
		var Body = '<OptionId>' + optionId + '</OptionId>';
		//console.log(Body);
		return Body;
	},
	HotelBookingByOptionIdRoomId(optionId, roomId, bookingDetails, requestType) {
		var Adult1="", Adult2="", Adult3="", Child1="", Child2="", Child3 = "";

		if (bookingDetails.Adult1FirstName)
			Adult1 =
				'<AdultName>' +
				'	<Title>' + bookingDetails.Adult1Title + '</Title>' +
				'	<FirstName>' + bookingDetails.Adult1FirstName + '</FirstName>' +
				'	<LastName>' + bookingDetails.Adult1LastName + '</LastName>' +
				'</AdultName>';
		if (bookingDetails.Adult2FirstName)
			Adult2 =
				'<AdultName>' +
				'	<Title>' + bookingDetails.Adult2Title + '</Title>' +
				'	<FirstName>' + bookingDetails.Adult2FirstName + '</FirstName>' +
				'	<LastName>' + bookingDetails.Adult2LastName + '</LastName>' +
				'</AdultName>';
		if (bookingDetails.Adult3FirstName)
			Adult3 =
				'<AdultName>' +
				'	<Title>' + bookingDetails.Adult3Title + '</Title>' +
				'	<FirstName>' + bookingDetails.Adult3FirstName + '</FirstName>' +
				'	<LastName>' + bookingDetails.Adult3LastName + '</LastName>' +
				'</AdultName>';
		if (bookingDetails.Child1FirstName)
			Child1 =
				'<ChildName>' +
				'	<FirstName>' + bookingDetails.Child1FirstName + '</FirstName>' +
				'	<LastName>' + bookingDetails.Child1LastName + '</LastName>' +
				'</ChildName>';
		if (bookingDetails.Child2FirstName)
			Child2 =
				'<ChildName>' +
				'	<FirstName>' + bookingDetails.Child2FirstName + '</FirstName>' +
				'	<LastName>' + bookingDetails.Child2LastName + '</LastName>' +
				'</ChildName>';
		if (bookingDetails.Child3FirstName)
			Child3 =
				'<ChildName>' +
				'	<FirstName>' + bookingDetails.Child3FirstName + '</FirstName>' +
				'	<LastName>' + bookingDetails.Child3LastName + '</LastName>' +
				'</ChildName>';
		var Body = '<OptionId>' + optionId + '</OptionId>' +
			'<YourReference>' + bookingDetails.YourReference + '</YourReference>' +
			'<Rooms>' +
			'	<Room>' +
			'		<RoomId>' + roomId + '</RoomId>' +
			'		<PaxNames>' +
						Adult1 + Adult2 + Adult3 + Child1 + Child2 + Child3 +
			'		</PaxNames>' +
			'	</Room>' +
			'</Rooms>';
		//console.log(Body);
		return Body;
	},
	GetBookingDetails(bookingReference) {
		var Body =
			'<BookingReference>' + bookingReference.BookingReference + '</BookingReference>';
		console.log("GetBookingDetails Request : " + Body);
		return Body;
	},
};