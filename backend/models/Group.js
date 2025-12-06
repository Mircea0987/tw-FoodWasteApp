//The group class
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const Group = sequelize.define('Group', {

    GroupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

module.exports = Group;