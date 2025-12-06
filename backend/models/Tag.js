//The tag class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const Tag = sequelize.define('Tag', {
    
    TagID:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        autoIncrementIdentity:true
    },
    TagName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

module.exports = Tag;