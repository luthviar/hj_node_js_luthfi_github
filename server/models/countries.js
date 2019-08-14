module.exports = function(sequelize, Sequelize) {

    var Countries = sequelize.define('countries', {
        CountryCode: {
            type: Sequelize.STRING(2)
        },
        CountryName: {
            type: Sequelize.STRING(100)
        },
        // Timestamps
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    return Countries;

}