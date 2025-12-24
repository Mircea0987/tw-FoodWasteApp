const { Sequelize } = require("sequelize");
require('dotenv').config();


const sequelize = new Sequelize(
    process.env.USER_AND_NAME,
    process.env.USER_AND_NAME,          
    process.env.PASS,   
    {
        host: process.env.HOST, 
        dialect: "postgres",
        port: 5432,
        dialectOptions: {
            ssl: {
                require: true, 
                rejectUnauthorized: false 
            }
        },
        logging: false 
    }
);

module.exports = sequelize;
