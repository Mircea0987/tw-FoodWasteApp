const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "wb-project",
  "postgres",
  "admin",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize;
