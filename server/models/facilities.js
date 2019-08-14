
module.exports = function(sequelize, Sequelize) {

    var Facilities = sequelize.define('facilities', {
        HotelId: {
            foreignKey: true,
            type: Sequelize.INTEGER(11)
        },
        FacilityType: {
            type: Sequelize.STRING(50),
        },
        FacilityName: {
            type: Sequelize.STRING(200),
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    return Facilities;
    
}