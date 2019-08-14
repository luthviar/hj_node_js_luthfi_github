
module.exports = function(sequelize, Sequelize) {
    var Images = sequelize.define('images', {
        HotelId: {
            foreignKey: true,
            type: Sequelize.INTEGER(11)
        },
        Image: {
            type: Sequelize.STRING(200),
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });
    return Images;
}