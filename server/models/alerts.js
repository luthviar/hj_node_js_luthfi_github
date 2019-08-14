/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alerts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    TransactionId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'TransactionId'
      }
    },
    Alert: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'alerts'
  });
};
