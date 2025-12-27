//The productList class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const ProductList = sequelize.define('ProductList', {
  ListID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ListName: DataTypes.STRING,
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true   
  }
});

module.exports = ProductList;