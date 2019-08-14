
module.exports = function(sequelize, Sequelize) {

    var Descriptions = sequelize.define('descriptions', {
        HotelId: {
            foreignKey: true,
            type: Sequelize.INTEGER(11)
        },
        Description: {
            type: Sequelize.TEXT('long')
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    return Descriptions;

}