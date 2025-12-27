//Utils
const express = require("express");
const bodyParser = require('body-parser')
const sequelize = require("./database/sequelize");
const errorHandler = require("./middleware/errorHandler");

const cors = require('cors'); // Implementat de Costin (CORS)

require('dotenv').config()

//console.log(process.env.JWT_PASS);


//Models
const Category = require("./models/Category");
const Group = require("./models/Group");
const Product = require("./models/Product");
const ProductList = require("./models/ProductList");
const User = require("./models/User");
const Tag = require("./models/Tag");

//Routing
const mainRouter = require("./routing/mainRouter");

//Relationships

//M-M between Users and Group
User.belongsToMany(Group, { through: "UserGroup" });
Group.belongsToMany(User, { through: "UserGroup" });


//M-M between Tag and User
User.belongsToMany(Tag, { through: "UserTag" });
Tag.belongsToMany(User, { through: "UserTag" });

//1-M between Category and Products

Category.hasMany(Product);
Product.belongsTo(Category);

//1-M between Products and ProductList

Product.hasMany(ProductList);
ProductList.belongsTo(Product);

//1-1 between ProductList and User

User.hasOne(ProductList);
ProductList.belongsTo(User);

//Using middlewares

const app = express();
app.use(cors()); // Implementat de Costin (CORS)

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api",mainRouter);

//Set up the routings

app.get("/create", async (req, res,next) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: "Database created with the models." });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

//Start the server on port 8001

app.listen((process.env.PORT_NUMBER),()=>{
    console.log(`The server is running... on port ${process.env.PORT_NUMBER}`);
    
})