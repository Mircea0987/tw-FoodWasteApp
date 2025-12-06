//The category class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const Category = sequelize.define('Category', {

    CategoryID:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        autoIncrementIdentity:true
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

module.exports = Category;