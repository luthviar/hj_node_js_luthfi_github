/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('policies', {
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
    From: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Value: {
      type: DataTypes.STRING(100),
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
    tableName: 'policies'
  });
};
