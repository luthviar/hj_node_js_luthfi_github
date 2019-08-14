/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rooms', {
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
    RoomName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    NumAdults: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    NumChildren: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'rooms'
  });
};
