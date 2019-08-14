/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    TransactionId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    HotelId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    BookingReference: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    YourReference: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    BookingStatus: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PaymentToken: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PaymentStatus: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PaymentCustomerId: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PaymentChargeId: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PaymentCardId: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    BookingTime: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Currency: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AgentPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    TotalPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    HotelName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    CheckInDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CheckOutDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LeaderName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    UserId: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Nationality: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    BoardType: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    CancellationDeadline: {
      type: DataTypes.DATE,
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
    tableName: 'transactions'
  });
};
