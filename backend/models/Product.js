//The product class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('Product', {

    ProductID:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        autoIncrementIdentity:true
    },
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'CategoryID',
      },
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ExpirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Description: {
      type: DataTypes.TEXT, 
      allowNull: true,
    },
    ListID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProductLists',
        key: 'ListID',
      },
    },
  },
)
module.exports = Product;