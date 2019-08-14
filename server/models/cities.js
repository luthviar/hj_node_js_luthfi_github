module.exports = function(sequelize, Sequelize) {

    var Cities = sequelize.define('cities', {
        CityId: {
            primaryKey: true,
            type: Sequelize.INTEGER(11)
        },
        CityName: {
            type: Sequelize.STRING(50)
        },
        StateCode: {
            type: Sequelize.STRING(10)
        },
        CountryCode: {
            type: Sequelize.STRING(2)
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    return Cities;

}