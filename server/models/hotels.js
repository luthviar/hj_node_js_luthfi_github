
module.exports = function(sequelize, Sequelize) {

    var Hotel = sequelize.define('hotels', {
        HotelId: {
            primaryKey: true,
            type: Sequelize.INTEGER(11)
        },
        CityId: {
            foreignKey: true,
            type: Sequelize.INTEGER(11),
            notEmpty: true
        },
        HotelName: {
            type: Sequelize.STRING(255)
        },
        StarRating: {
            type: Sequelize.INTEGER(11)
        },
        Latitude: {
            type: Sequelize.DOUBLE
        },
        Longitude: {
            type: Sequelize.DOUBLE
        },
        Address: {
            type: Sequelize.STRING(255)
        },
        Location: {
            type: Sequelize.STRING(255)
        },
        PhoneNumber: {
            type: Sequelize.DOUBLE
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,

    });

    return Hotel;

}