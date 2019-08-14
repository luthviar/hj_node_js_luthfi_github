/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('restrictions', {
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
    Restriction: {
      type: DataTypes.STRING(200),
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
    tableName: 'restrictions'
  });
};
