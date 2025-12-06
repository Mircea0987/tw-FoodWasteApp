//The productList class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const ProductList = sequelize.define('ProductList', {
    
    ListID:{
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true,
        autoIncrementIdentity:true
    },
    ListName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);


module.exports = ProductList;