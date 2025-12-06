//The user class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {

    UserID:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        autoIncrementIdentity:true
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true,
      },
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AvatarPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ListID: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: 'ProductLists', 
        key: 'ListID',
      },
    },
  }
);

module.exports = User;
