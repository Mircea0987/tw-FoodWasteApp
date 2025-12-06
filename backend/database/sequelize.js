const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "postgres",      
    "postgres",            
    "H2YZ7YX3",   
    {
        host: "wb-project-2.cdkisiu46vzr.eu-north-1.rds.amazonaws.com", 
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
